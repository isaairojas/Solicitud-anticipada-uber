# MCP de Figma — herramientas y estado de conexión

**Estado (2026-09-29): CONECTADO** — servidor remoto oficial de Figma (`https://mcp.figma.com/mcp`, opción A de FIGMA_REPLICA.md §2.1), expuesto en esta sesión como conector de Claude.

## Cuenta (`whoami`)

| Campo | Valor |
|---|---|
| Handle | Brethan |
| Planes | `brethan.beltran's team` — tier **starter**, asiento Full, rol admin · `UX/UI Exodus` — tier **pro**, asiento Full, rol guest |
| Límites | `whoami` no reporta cuotas. Referencia: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/ |

> El plan que aplica es el del equipo dueño del archivo. Se hicieron ~40 llamadas en F0 sin error de cuota, por lo que el archivo no parece estar en el plan Starter (que tiene cuota muy baja). **PENDIENTE:** confirmar a qué equipo pertenece el archivo para planear lotes (ver `inventory.md` §7).

## Herramientas disponibles (nombres y parámetros reales)

Prefijo real en esta sesión: `mcp__f478769e-62c7-43be-a126-685589352d3a__<herramienta>`.

| Herramienta | Parámetros | Notas observadas en F0 |
|---|---|---|
| `whoami` | — | Cuenta, planes y asientos. |
| `get_metadata` | `fileKey` (req.), `nodeId` (opc.) | Sin `nodeId` lista páginas de nivel superior. **Solo devolvió `16:16 ✨ Cover`**, aunque el archivo tiene 14 páginas: el listado está incompleto. Para el listado real se usa `use_figma`. Con la página Revisión (`3048:10012`) la respuesta supera el límite del transporte (error "Invalid JSON: EOF" a ~820 KB), así que en páginas grandes se consulta por sección o con `use_figma`. XML con `id`, `name`, `x`, `y`, `width`, `height`, `hidden`. No incluye textos ni fills. |
| `get_design_context` | `fileKey`, `nodeId` (req.); `clientFrameworks`, `clientLanguages`, `disableCodeConnect`, `excludeScreenshot`, `forceCode`, `skillNames` | Requiere cargar la guía `figma-design-to-code` antes de usarlo. No usado en F0. |
| `get_screenshot` | `fileKey`, `nodeId` (req.); `maxDimension` (def. 1024, máx. 65536), `contentsOnly`, `enableBase64Response` | Devuelve URL temporal del PNG; se descarga con `curl`. Las secciones se renderizan con ~40 px de margen por lado. |
| `get_variable_defs` | `fileKey`, `nodeId` (req.) | **Falla sobre un canvas/página** ("You currently have nothing selected"); funciona sobre frames/componentes. Mezcla variables y estilos (color, tipografía, efectos) en un solo mapa. |
| `get_libraries` | `fileKey` (req.), `offset` | Librerías agregadas al archivo y disponibles. |
| `search_design_system` | `fileKey`, `queries[]` (req.); `includeLibraryKeys`, `disableCodeConnect` | **El servidor recorta el lote a 1 query por llamada.** Busca en todas las librerías de la organización. |
| `download_assets` | `fileKey`, `nodeId` (req.); `defaultFormat` (png/jpg/svg/pdf), `defaultScale` (0.01–4) | Para F2. |
| `get_code_connect_map` / `add_code_connect_map` | — | Para F3 (Code Connect). |
| `get_code_connect_suggestions`, `get_context_for_code_connect`, `list_file_components_for_code_connect`, `send_code_connect_mappings` | — | Code Connect (F3/F7). |
| `create_design_system_rules` | — | Existe en el servidor secundario `mcp__Figma__*` (F7). |
| `get_motion_context` | — | Posible fuente de transiciones/animaciones para F5 (por evaluar). |
| `use_figma` | `fileKey`, `code`, `description` (req.); `skillNames` | Ejecuta JS de la Plugin API. **Se usa solo con scripts de lectura** (nunca muta el archivo). Antes hay que cargar `skill://figma/figma-use/SKILL.md` con `get_figma_skill`. Sirvió para: listar todas las páginas (`figma.root.children`), resolver componentes maestros (`getMainComponentAsync`, incluidos los remotos), leer estilos y colecciones de variables locales, y **leer interacciones de prototipo** (`node.reactions`, `page.flowStartingPoints`). Cambia de página una vez por llamada (`setCurrentPageAsync`). La respuesta se corta cerca de 20 KB, así que conviene devolver texto compacto. |
| `get_figma_skill` | `uri` (`skill://…`) | Lee las guías del servidor (obligatorio antes de `use_figma` y `get_design_context`). |
| Escritura (`create_new_file`, `upload_assets`, `generate_diagram`, mutaciones con `use_figma`, …) | — | **No se usan**: Figma es solo lectura en este proyecto. |

Existe además un segundo servidor (`mcp__Figma__*`) con un subconjunto (`get_metadata`, `get_design_context`, `get_screenshot`, `get_variable_defs`, `get_code_connect_map`, `add_code_connect_map`, `create_design_system_rules`) que trabaja sobre la selección de Figma Desktop. Se usa el remoto porque acepta `fileKey` + `nodeId`.

## Formato de `nodeId`

URL `node-id=5170-10163` ↔ MCP `5170:10163`.
