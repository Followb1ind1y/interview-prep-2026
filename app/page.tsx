import { AnnotationSeed } from '@/components/annotate/seed'
import { HomeHeatmap } from '@/components/home/heatmap'
import { HomeHero } from '@/components/home/hero'
import { HomeMetrics } from '@/components/home/metrics'
import { HomeRoadmap, type RoadmapPhase } from '@/components/home/roadmap'
import { HomeTimeline } from '@/components/home/timeline'
import profile from '@/contents/site/profile.json'
import roadmap from '@/contents/site/roadmap.json'
import timeline from '@/contents/site/timeline.json'
import { getActivityDays, getContentCounts } from '@/lib/activity'
import { getPageAnnotations } from '@/lib/annotate/file'
import { Settings } from '@/types/settings'

export default async function Home() {
  const [activity, counts, annotations] = await Promise.all([
    getActivityDays(),
    getContentCounts(),
    getPageAnnotations('/'),
  ])
  const now = new Date()
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const activeDays = activity.filter(
    (day) => day.date.startsWith(monthPrefix) && day.count > 0
  ).length

  return (
    <div className="pb-16">
      <AnnotationSeed annotations={annotations} path="/" />
      <HomeHero bio={profile.bio} name={profile.name} role={profile.role} />
      <HomeMetrics
        activeDays={activeDays}
        companies={Math.max(0, counts.companies - 2)}
        notes={counts.docs}
        targetDate={Settings.targetDate}
      />
      <HomeTimeline items={timeline} />
      <HomeHeatmap activity={activity} />
      <HomeRoadmap phases={roadmap as RoadmapPhase[]} />
    </div>
  )
}
