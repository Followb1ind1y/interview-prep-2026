'use client'

import { useEffect } from 'react'

import { seedAnnotations } from '@/lib/annotate/store'
import { type Annotation } from '@/lib/annotate/types'

/** 把服务端从 contents/site/annotations.json 读到的本页批注交给客户端 */
export function AnnotationSeed({ annotations, path }: { annotations: Annotation[]; path: string }) {
  useEffect(() => {
    seedAnnotations(path, annotations)
  }, [annotations, path])

  return null
}
