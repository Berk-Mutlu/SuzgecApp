import { watchLists } from "@/lib/mock-data"
import ListDetailClient from "@/components/list/ListDetailClient"
export async function generateStaticParams() {
    return watchLists.map((list) => ({
        id: list.id,
    }))
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
    return <ListDetailClient params={params} />
}
