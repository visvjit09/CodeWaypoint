
import { apiConnector } from "../apiConnector"
import { lessonBookmarkEndpoints } from "../apis"

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
})

// Get all bookmarks and notes for the logged-in user
export async function getLessonBookmarks(token) {
  const response = await apiConnector(
    "GET",
    lessonBookmarkEndpoints.GET_ALL_BOOKMARKS_API,
    null,
    authHeaders(token)
  )

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Could not load bookmarks"
    )
  }

  return response.data.data
}

// Get bookmark and notes for one lesson
export async function getLessonBookmark(subSectionId, token) {
  const response = await apiConnector(
    "GET",
    `${lessonBookmarkEndpoints.GET_LESSON_BOOKMARK_API}/${subSectionId}`,
    null,
    authHeaders(token)
  )

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Could not load lesson notes"
    )
  }

  return response.data.data
}

// Save or update a lesson bookmark and its notes
export async function saveLessonBookmark(subSectionId, data, token) {
  const response = await apiConnector(
    "PUT",
    `${lessonBookmarkEndpoints.SAVE_LESSON_BOOKMARK_API}/${subSectionId}`,
    data,
    authHeaders(token)
  )

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Could not save bookmark or notes"
    )
  }

  return response.data.data
}
