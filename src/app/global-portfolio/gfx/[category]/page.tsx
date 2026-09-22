import { redirect } from 'next/navigation';

export default function GlobalGfxCategoryRoute({
  params,
}: {
  params: { category: string };
}) {
  redirect(`/global-portfolio?track=GFX&cat=${encodeURIComponent(params.category)}`);
}
