import {
	BookOpen,
	Rocket,
	Trophy,
	Map,
	Users,
	Wrench,
	Cpu,
	ShoppingCart,
	type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'guide' -> t('nav.guide')
	path: string // URL 路径，如 '/guide'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 分类与 content/ 目录一一对应；key 同时是 nav/pages/DetailPage 的统一来源
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'updates', path: '/updates', icon: Rocket, isContentType: true },
	{ key: 'achievements', path: '/achievements', icon: Trophy, isContentType: true },
	{ key: 'levels', path: '/levels', icon: Map, isContentType: true },
	{ key: 'multiplayer', path: '/multiplayer', icon: Users, isContentType: true },
	{ key: 'equipment', path: '/equipment', icon: Wrench, isContentType: true },
	{ key: 'technical', path: '/technical', icon: Cpu, isContentType: true },
	{ key: 'purchase', path: '/purchase', icon: ShoppingCart, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['guide', 'updates', ...]

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
