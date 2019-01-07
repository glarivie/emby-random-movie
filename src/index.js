const axios = require('axios')
const random = require('lodash.random')
const get = require('lodash.get')
const { log } = require('console')

const { ticksToMinutes, humanize } = require('./time')

require('dotenv').config()

const { EMBY_API_KEY, EMBY_API_ENDPOINT, EMBY_USER_ID } = process.env

const http = axios.create({
  baseURL: EMBY_API_ENDPOINT,
  timeout: 1000,
  headers: {
    'X-Emby-Token': EMBY_API_KEY,
  },
})

const getRandomVideo = async () => {
  const { data: { Items } } = await http.get(`/Users/${EMBY_USER_ID}/Items`, {
    params: {
      SortBy: 'SortName',
      SortOrder: 'Ascending',
      IncludeItemTypes: 'Movie',
      Recursive: true,
      StartIndex: 0,
    },
  })

  const unseen = Items.filter(movie => !get(movie, 'UserData.Played', false))
  const { Id, ...movie } = unseen[random(0, unseen.length - 1)]

  log({
    _id: Id,
    name: get(movie, 'Name', ''),
    subtitles: get(movie, 'HasSubtitles', false),
    rating: get(movie, 'CommunityRating', 0),
    duration: humanize(ticksToMinutes(get(movie, 'RunTimeTicks', 0))),
    cover: `${EMBY_API_ENDPOINT}/Items/${Id}/Images/Primary`,
  })
}

getRandomVideo()
