import type * as React from 'react';

export type IconName = 'shield-check' | 'package' | 'package-search' | 'file-text' | 'clipboard-check' | 'headset' | 'phone' | 'globe' | 'map-pin' | 'route' | 'radar' | 'truck' | 'ship' | 'plane' | 'warehouse' | 'building-2' | 'users' | 'layers' | 'database' | 'chart-line' | 'brain-circuit' | 'bot' | 'clock' | 'check' | 'triangle-alert' | 'play' | 'arrow-right' | 'arrow-up-right' | 'chevron-down' | 'mail';
export interface CtaLink { label: string; href?: string }

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'accent' | 'outline' | 'ghost'; size?: 'sm' | 'md' | 'lg'; arrow?: boolean; block?: boolean; href?: string }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface IconButtonProps { icon?: IconName; label: string; variant?: 'outline' | 'solid' | 'light' | 'paper'; size?: 'sm' | 'md' | 'lg'; href?: string; onClick?: React.MouseEventHandler }
export declare function IconButton(props: IconButtonProps): React.ReactElement;
export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { children: React.ReactNode }
export declare function TextLink(props: TextLinkProps): React.ReactElement;
export interface VideoLinkProps { href?: string; onClick?: React.MouseEventHandler; children: string }
export declare function VideoLink(props: VideoLinkProps): React.ReactElement;
export interface IconProps { name: IconName; size?: number; strokeWidth?: number; label?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;
export interface LogoProps { layout?: 'stacked' | 'horizontal' | 'mark'; tone?: 'on-navy' | 'on-blue' | 'navy' | 'blue' | 'white' | 'black' | 'auto'; size?: number }
export declare function Logo(props: LogoProps): React.ReactElement;
export interface EyebrowProps { dot?: boolean; children: React.ReactNode }
export declare function Eyebrow(props: EyebrowProps): React.ReactElement;
export interface HeadlineProps { level?: 'display' | 'h1' | 'h2'; as?: string; accent?: string; accentMuted?: boolean; muted?: string; children: React.ReactNode }
export declare function Headline(props: HeadlineProps): React.ReactElement;
export interface LanguageOption { code: string; label: string; name: string; href?: string; rel?: string }
export interface LanguageToggleProps { value?: string; defaultValue?: string; onChange?: (code: string) => void; languages?: LanguageOption[]; icon?: boolean; label?: string }
export declare function LanguageToggle(props: LanguageToggleProps): React.ReactElement;
export interface NavBarProps { links: { label: string; href?: string; active?: boolean }[]; phone?: string; hours?: string; cta?: CtaLink; language?: LanguageToggleProps; logoTone?: LogoProps['tone']; homeHref?: string; ariaLabel?: string; menuLabel?: string }
export declare function NavBar(props: NavBarProps): React.ReactElement;
export interface FeatureItemProps { icon: IconName; children: React.ReactNode }
export declare function FeatureItem(props: FeatureItemProps): React.ReactElement;
export interface StatChipProps { value: string; label: string; badges?: (IconName | string)[] }
export declare function StatChip(props: StatChipProps): React.ReactElement;
export interface StatusBadgeProps { status?: 'transit' | 'delivered' | 'delayed' | 'issue'; children?: React.ReactNode }
export declare function StatusBadge(props: StatusBadgeProps): React.ReactElement;
export interface TrackingCardProps { id: string; label?: string; status?: StatusBadgeProps['status']; statusLabel?: string; from: string; fromMeta?: string; to: string; toMeta?: string; progress?: number; steps?: { label: string; time?: string; state?: 'done' | 'current' }[] }
export declare function TrackingCard(props: TrackingCardProps): React.ReactElement;
export interface HeroProps { eyebrow?: string; title: string; titleAccent?: string; titleMuted?: string; lede?: string; cta?: CtaLink; video?: CtaLink; features?: { icon: IconName; text: string }[]; media?: React.ReactNode; tracking?: TrackingCardProps; stat?: StatChipProps }
export declare function Hero(props: HeroProps): React.ReactElement;
export interface SectionProps { tone?: 'card' | 'plain' | 'navy'; overlap?: boolean; id?: string; children: React.ReactNode }
export declare function Section(props: SectionProps): React.ReactElement;
export interface SectionHeaderProps { eyebrow?: string; title: string; muted?: string; accent?: string; accentMuted?: boolean; level?: 'h1' | 'h2'; as?: string; action?: CtaLink }
export declare function SectionHeader(props: SectionHeaderProps): React.ReactElement;
export interface ImageTileProps { src?: string; srcSet?: string; sizes?: string; imageWidth?: number; imageHeight?: number; priority?: boolean; alt?: string; ratio?: string; height?: string; color?: boolean; icon?: IconName; className?: string }
export declare function ImageTile(props: ImageTileProps): React.ReactElement;
export interface ServiceCardImage { src: string; srcSet?: string; sizes?: string; imageWidth?: number; imageHeight?: number; alt?: string }
export interface ServiceCardProps { title: string; bullets: string[]; icon?: IconName; image?: string | ServiceCardImage; href?: string }
export declare function ServiceCard(props: ServiceCardProps): React.ReactElement;
export interface AboutBlockProps { eyebrow?: string; title: string; titleAccent?: string; body?: string; note?: string; noteIcon?: IconName; imageA?: ImageTileProps; imageB?: ImageTileProps; cta?: CtaLink }
export declare function AboutBlock(props: AboutBlockProps): React.ReactElement;

// Additions for the website (see specs/001-intello-marketing-website/contracts/design-system-additions.md)
export interface SkipLinkProps { href?: string; children: React.ReactNode }
export declare function SkipLink(props: SkipLinkProps): React.ReactElement;
export interface FooterLink { label: string; href?: string }
export interface FooterProps { columns?: { heading: string; links: FooterLink[] }[]; contact?: { heading: string; phone?: string; phoneHref?: string; hours?: string; address?: string }; tagline?: string; language?: LanguageToggleProps; legal?: { text?: string; links?: FooterLink[] }; logoTone?: LogoProps['tone']; homeHref?: string }
export declare function Footer(props: FooterProps): React.ReactElement;
export interface CtaBandProps { eyebrow?: string; title: string; titleAccent?: string; body?: string; cta?: CtaLink; secondary?: CtaLink }
export declare function CtaBand(props: CtaBandProps): React.ReactElement;
export interface PageHeroProps { eyebrow?: string; title: string; titleAccent?: string; titleMuted?: string; lede?: string; cta?: CtaLink; secondary?: CtaLink; media?: ImageTileProps }
export declare function PageHero(props: PageHeroProps): React.ReactElement;
export interface ServiceSectionProps { id?: string; eyebrow?: string; title: string; summary?: string; deliverables?: string[]; cta?: CtaLink; image?: ImageTileProps; reverse?: boolean }
export declare function ServiceSection(props: ServiceSectionProps): React.ReactElement;
export interface StepsProps { items: { title: string; body: string; icon?: IconName }[] }
export declare function Steps(props: StepsProps): React.ReactElement;
export interface AccordionProps { items: { id: string; question: string; answer: string | string[] }[] }
export declare function Accordion(props: AccordionProps): React.ReactElement;
export interface ProseProps { className?: string; children: React.ReactNode }
export declare function Prose(props: ProseProps): React.ReactElement;
export interface FieldProps { id: string; label: string; hint?: string; error?: string; required?: boolean; className?: string; children: React.ReactElement }
export declare function Field(props: FieldProps): React.ReactElement;
export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> { value?: string; invalid?: boolean }
export declare function TextInput(props: TextInputProps): React.ReactElement;
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { value?: string; invalid?: boolean }
export declare function Textarea(props: TextareaProps): React.ReactElement;
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'> { options: { value: string; label: string }[]; value?: string; invalid?: boolean }
export declare function Select(props: SelectProps): React.ReactElement;
export interface FormNoticeProps { variant?: 'success' | 'error' | 'info'; title?: string; role?: string; className?: string; children?: React.ReactNode }
export declare function FormNotice(props: FormNoticeProps): React.ReactElement;
export interface FormErrorSummaryProps { title: string; errors: { id: string; message: string }[]; id?: string }
export declare function FormErrorSummary(props: FormErrorSummaryProps): React.ReactElement | null;
export interface HoneypotProps { name?: string; label?: string }
export declare function Honeypot(props: HoneypotProps): React.ReactElement;
