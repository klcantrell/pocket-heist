// preview page for newly created UI components

import { SkeletonCard } from "@/components/Skeleton"
import Avatar from "@/components/Avatar"

export default function PreviewPage() {
  return (
    <div className="page-content">
      <h2>Preview</h2>
      <div className="grid grid-cols-3 gap-6 mt-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      <h3 className="mt-8">Avatar</h3>
      <div className="avatar-preview">
        <Avatar name="Alice" />
        <Avatar name="HeistDetails" />
        <Avatar name="bob" />
      </div>
    </div>
  )
}
