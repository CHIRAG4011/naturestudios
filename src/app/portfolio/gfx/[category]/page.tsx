import { redirect } from 'next/navigation';

export default function StudioGfxCategoryRoute({
  params,
}: {
  params: { category: string };
}) {
  redirect(`/portfolio?track=GFX&cat=${encodeURIComponent(params.category)}`);
}
