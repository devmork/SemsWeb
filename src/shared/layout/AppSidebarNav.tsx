"use client"

import { useCallback, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"
import { Link } from "@tanstack/react-router"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { NavigationSection } from "@/shared/config/navigation/types"

export function AppSidebarNav({ sections }: { sections: NavigationSection[] }) {
  const groupRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map())

  const allItems = sections.flatMap((s) => s.items)
  const activeItem = allItems.find((i) => i.isActive)
  const activeHref = activeItem?.href ?? null

  // Spring-animated position/size of the active-item highlight pill.
  const top = useMotionValue(0)
  const height = useMotionValue(0)
  const topY = useSpring(top, { damping: 22, stiffness: 300 })
  const heightY = useSpring(height, { damping: 22, stiffness: 300 })

  const moveTo = useCallback(
    (href: string) => {
      const itemEl = itemRefs.current.get(href)
      const group = groupRef.current
      if (!itemEl || !group) return
      const itemRect = itemEl.getBoundingClientRect()
      const groupRect = group.getBoundingClientRect()
      top.set(itemRect.top - groupRect.top)
      height.set(itemRect.height)
    },
    [top, height],
  )

  // Reposition the pill whenever the active item changes.
  useEffect(() => {
    if (activeHref) moveTo(activeHref)
  }, [activeHref, moveTo])

  // Re-measure on resize so the pill stays aligned.
  useEffect(() => {
    if (!activeHref || !groupRef.current) return
    const ro = new ResizeObserver(() => moveTo(activeHref))
    ro.observe(groupRef.current)
    return () => ro.disconnect()
  }, [activeHref, moveTo])

  if (allItems.length === 0) return null

  return (
    <div ref={groupRef} className="relative flex flex-col gap-4">
      {/* Active-item pill — glides between items on a spring. Reads the
          active-state tokens from index.css (bg-sidebar-accent /
          text-sidebar-accent-foreground). */}
      <motion.div
        aria-hidden
        style={{ top: topY, height: heightY }}
        className="pointer-events-none absolute left-1/2 -z-10 w-[calc(100%-1rem)] -translate-x-1/2 rounded-md bg-sidebar-accent"
      />
      {sections.map((section) =>
        section.items.length === 0 ? null : (
          <SidebarGroup key={section.label} className="gap-0 py-0">
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <div
                    ref={(el) => {
                      if (el) itemRefs.current.set(item.href, el)
                    }}
                  >
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={item.isActive}
                      render={<Link to={item.href} />}>
                      <item.icon aria-hidden />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ),
      )}
    </div>
  )
}
