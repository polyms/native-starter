import i18n from '~/i18n/i18n'

import { useMemo } from 'react'
import { create } from 'zustand'

import { formatDate } from '~/utils/formatDate'

export const useEpisodeStore = create<EpisodeState>((set, get) => ({
  favorites: [],
  favoritesOnly: false,
  // actions
  addFavorite(episode: Episode) {
    get().favorites.push(episode)
  },
  removeFavorite(episode: Episode) {
    set({ favorites: get().favorites.filter((x) => x.guid !== episode.guid) })
  },
  toggleFavoritesOnly: () => set((s) => ({ favoritesOnly: !s.favoritesOnly })),
}))

function getParsedTitleAndSubtitle(episode: Episode) {
  const defaultValue = { title: episode.title?.trim(), subtitle: '' }

  if (!defaultValue.title) return defaultValue

  const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

  if (!titleMatches || titleMatches.length !== 3) return defaultValue

  return { title: titleMatches[1], subtitle: titleMatches[2] }
}

function getDatePublished(episode: Episode) {
  try {
    const formatted = formatDate(episode.pubDate)
    return {
      textLabel: formatted,
      accessibilityLabel: i18n.t('demoPodcastListScreen.accessibility.publishLabel', {
        date: formatted,
      }) as string,
    }
  } catch (error) {
    return { textLabel: '', accessibilityLabel: '' }
  }
}

function getDuration(episode: Episode) {
  const seconds = Number(episode.enclosure.duration)
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor((seconds % 3600) % 60)

  const hDisplay = h > 0 ? `${h}:` : ''
  const mDisplay = m > 0 ? `${m}:` : ''
  const sDisplay = s > 0 ? s : ''
  return {
    textLabel: hDisplay + mDisplay + sDisplay,
    accessibilityLabel: i18n.t('demoPodcastListScreen.accessibility.durationLabel', {
      hours: h,
      minutes: m,
      seconds: s,
    }) as string,
  }
}

export const useEpisode = (episode: Episode) => {
  return useMemo(
    () => ({
      ...getParsedTitleAndSubtitle(episode),
      datePublished: getDatePublished(episode),
      duration: getDuration(episode),
    }),
    [episode.guid],
  )
}

// ================================================================================================

export interface EpisodeState {
  favorites: Episode[]
  favoritesOnly: boolean
  // actions
  addFavorite: (episode: Episode) => void
  removeFavorite: (episode: Episode) => void
  toggleFavoritesOnly: () => void
}

export type Episode = {
  guid: string
  title: string
  pubDate: string // Ex: 2022-08-12 21:05:36
  link: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure: Enclosure
  categories: string[]
}

interface Enclosure {
  link: string
  type: string
  length: number
  duration: number
  rating: { scheme: string; value: string }
}
