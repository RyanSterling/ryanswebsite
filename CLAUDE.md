# Claude Project Notes

## Pending Launch Tasks

### The Content Compass Course
**Status:** Preview mode - not yet launched

When Ryan says he's ready to launch The Content Compass course:

1. Remove the preview check in `src/pages/ContentCompassSalesPage.tsx` (lines 10-20):
   - Delete the `useSearchParams` import
   - Delete the `PREVIEW_KEY` constant
   - Delete the `searchParams` and `isPreview` code
   - Delete the early return that shows "Coming Soon"

2. Set the course to published in Supabase:
   ```sql
   UPDATE courses SET published = true WHERE slug = 'content-compass';
   ```

3. The course will then be live at `/content-compass`

**Preview URL (for testing):** `ryansterling.com/content-compass?preview=compass`
