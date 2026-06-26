"use client"

import { memo, type ReactNode } from "react"
import { ModalBody } from "@/components/modals/ModalBody"
import { ModalFooter } from "@/components/modals/ModalFooter"
import { ModalHeader } from "@/components/modals/ModalHeader"
import { ModalSidebar } from "@/components/modals/ModalSidebar"
import { cn } from "@/lib/utils"

type ModalFormLayoutProps = {
  titleId: string
  descriptionId: string
  title: string
  description: string
  onClose: () => void
  formId: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  footer: ReactNode
  children: ReactNode
}

export const ModalFormLayout = memo(function ModalFormLayout({
  titleId,
  descriptionId,
  title,
  description,
  onClose,
  formId,
  onSubmit,
  footer,
  children,
}: ModalFormLayoutProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden lg:grid lg:grid-cols-[340px_minmax(0,1fr)]">
      <ModalSidebar className="hidden shrink-0 rounded-none border-0 lg:flex lg:h-full lg:min-h-0 lg:border-r lg:border-orange-500/10" />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-white/10 p-6 md:p-8">
          <ModalHeader
            titleId={titleId}
            descriptionId={descriptionId}
            title={title}
            description={description}
            onClose={onClose}
          />
        </div>

        <ModalBody className="px-6 py-6 md:px-8">
          <form id={formId} onSubmit={onSubmit} className={cn("space-y-5 pb-4")}>
            {children}
          </form>
        </ModalBody>

        <ModalFooter>{footer}</ModalFooter>
      </div>
    </div>
  )
})
