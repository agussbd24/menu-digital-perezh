# Supabase Realtime

1. Ejecutá `supabase/schema.sql` en el SQL Editor del proyecto.
2. En Supabase, abrí `Database > Replication`.
3. Verificá que la tabla `public.orders` esté dentro de la publicación `supabase_realtime`.
4. La app usa `postgres_changes` para escuchar `INSERT`, `UPDATE` y `DELETE` en `orders`.

El schema revisa si `orders` ya existe en `supabase_realtime` antes de agregarla, así que podés ejecutarlo más de una vez durante la instalación.

Para un restaurante real con cocina interna, el schema permite lectura y actualización desde la anon key para mantener el flujo sin auth obligatoria. Si el panel `/kitchen` va a estar expuesto públicamente, sumá Supabase Auth o un Cloudflare Worker con service role para proteger los cambios de estado.
