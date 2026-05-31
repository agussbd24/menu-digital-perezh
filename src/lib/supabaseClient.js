import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isRealSupabase = Boolean(supabaseUrl && supabaseAnonKey)
export const isSupabaseConfigured = true // Always true since we have our robust Mock fallback

class MockSupabaseClient {
  constructor() {
    this.storageKey = 'restobar-mock-orders'
    this.subscribers = new Set()
    
    // Seed with high-fidelity mock orders so the stats and kitchen look alive out of the box
    if (!localStorage.getItem(this.storageKey)) {
      const dummyOrders = [
        {
          id: 'mock-order-1',
          table_number: '5',
          customer_name: 'Santiago Pérez',
          items: [
            { id: 'doble-cheeseburger', name: 'Doble Cheeseburger', quantity: 2, price: 14900, subtotal: 29800 }
          ],
          total: 29800,
          notes: 'Sin cebolla por favor',
          status: 'preparing',
          created_at: new Date(Date.now() - 15 * 60000).toISOString()
        },
        {
          id: 'mock-order-2',
          table_number: '12',
          customer_name: 'Lucía Fernández',
          items: [
            { id: 'la-gran-perez', name: 'La Gran Pérez', quantity: 1, price: 19900, subtotal: 19900 },
            { id: 'limonada', name: 'Limonada Natural', quantity: 1, price: 2500, subtotal: 2500 }
          ],
          total: 22400,
          notes: 'Limonada con hielo extra',
          status: 'new',
          created_at: new Date(Date.now() - 5 * 60000).toISOString()
        },
        {
          id: 'mock-order-3',
          table_number: '3',
          customer_name: 'Juan Ignacio',
          items: [
            { id: 'caramel-bacon', name: 'Caramel Bacon', quantity: 1, price: 16900, subtotal: 16900 }
          ],
          total: 16900,
          notes: 'Carne bien cocida',
          status: 'delivered',
          created_at: new Date(Date.now() - 45 * 60000).toISOString(),
          delivered_at: new Date(Date.now() - 25 * 60000).toISOString()
        }
      ]
      localStorage.setItem(this.storageKey, JSON.stringify(dummyOrders))
    }
  }

  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || []
    } catch {
      return []
    }
  }

  saveOrders(orders) {
    localStorage.setItem(this.storageKey, JSON.stringify(orders))
  }

  from(table) {
    const client = this
    return {
      select(query = '*') {
        return {
          order(col, { ascending } = {}) {
            let sorted = [...client.getOrders()]
            sorted.sort((a, b) => {
              const t1 = new Date(a.created_at).getTime()
              const t2 = new Date(b.created_at).getTime()
              return ascending ? t1 - t2 : t2 - t1
            })
            return Promise.resolve({ data: sorted, error: null })
          },
          eq(col, val) {
            return {
              single() {
                const orders = client.getOrders()
                const found = orders.find(o => o[col] === val || (col === 'id' && o.id === val))
                return Promise.resolve({ data: found || null, error: found ? null : new Error('Order not found') })
              }
            }
          }
        }
      },
      insert(rows) {
        return {
          select() {
            return {
              single() {
                const orders = client.getOrders()
                const newRow = {
                  id: 'mock-order-' + Math.random().toString(36).substr(2, 9),
                  created_at: new Date().toISOString(),
                  ...rows[0]
                }
                const updatedOrders = [newRow, ...orders]
                client.saveOrders(updatedOrders)
                
                // Dispatch event for realtime emulated synchronization
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('mock-supabase-realtime', {
                    detail: { eventType: 'INSERT', new: newRow }
                  }))
                }, 50)

                return Promise.resolve({ data: newRow, error: null })
              }
            }
          }
        }
      },
      update(fields) {
        return {
          eq(col, val) {
            return {
              select() {
                return {
                  single() {
                    const orders = client.getOrders()
                    let updatedRow = null
                    const updatedOrders = orders.map(o => {
                      if (o[col] === val || (col === 'id' && o.id === val)) {
                        updatedRow = { ...o, ...fields }
                        return updatedRow
                      }
                      return o
                    })
                    if (updatedRow) {
                      client.saveOrders(updatedOrders)
                      
                      // Dispatch event for realtime emulated synchronization
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('mock-supabase-realtime', {
                          detail: { eventType: 'UPDATE', new: updatedRow }
                        }))
                      }, 50)
                    }
                    return Promise.resolve({ data: updatedRow, error: updatedRow ? null : new Error('Order not found') })
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  channel(name) {
    const client = this
    return {
      on(event, filter, callback) {
        const handleEvent = (e) => {
          const payload = e.detail
          if (filter.event === '*' || filter.event === payload.eventType) {
            // Emulate postgres changes mapping logic
            if (name.startsWith('tracking-')) {
              const trackingId = name.split('tracking-')[1]
              if (payload.new?.id === trackingId) {
                callback(payload)
              }
            } else if (name === 'orders-realtime') {
              callback(payload)
            }
          }
        }
        
        this.subscription = handleEvent
        window.addEventListener('mock-supabase-realtime', handleEvent)
        return this
      },
      subscribe() {
        return this
      },
      unsubscribe() {
        if (this.subscription) {
          window.removeEventListener('mock-supabase-realtime', this.subscription)
        }
      }
    }
  }

  removeChannel(channel) {
    if (channel && channel.unsubscribe) {
      channel.unsubscribe()
    }
  }
}

export const supabase = isRealSupabase
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : new MockSupabaseClient()
