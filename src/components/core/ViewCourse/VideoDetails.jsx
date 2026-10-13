
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"

import "video-react/dist/video-react.css"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import {
  getLessonBookmark,
  saveLessonBookmark,
} from "../../../services/operations/lessonBookmarkAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../Common/IconBtn"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()

  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  const [isBookmarked, setIsBookmarked] = useState(false)
  const [notes, setNotes] = useState("")
  const [bookmarkLoading, setBookmarkLoading] = useState(true)
  const [bookmarkSaving, setBookmarkSaving] = useState(false)
  const [notesSaving, setNotesSaving] = useState(false)

  // Load the currently selected lesson.
  useEffect(() => {
    if (!courseSectionData.length) return

    if (!courseId || !sectionId || !subSectionId) {
      navigate("/dashboard/enrolled-courses")
      return
    }

    const selectedSection = courseSectionData.find(
      (section) => section._id === sectionId
    )

    const selectedVideo = selectedSection?.subSection?.find(
      (lesson) => lesson._id === subSectionId
    )

    setVideoData(selectedVideo || null)
    setPreviewSource(courseEntireData?.thumbnail || "")
    setVideoEnded(false)
  }, [
    courseSectionData,
    courseEntireData,
    courseId,
    sectionId,
    subSectionId,
    navigate,
    location.pathname,
  ])

  // Load this user's bookmark and notes for the selected lesson.
  useEffect(() => {
    let active = true

    async function loadLessonBookmark() {
      setIsBookmarked(false)
      setNotes("")

      if (!token || !subSectionId) {
        setBookmarkLoading(false)
        return
      }

      setBookmarkLoading(true)

      try {
        const data = await getLessonBookmark(subSectionId, token)

        if (active) {
          setIsBookmarked(Boolean(data.isBookmarked))
          setNotes(data.notes || "")
        }
      } catch (error) {
        if (active) {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Could not load lesson notes"
          )
        }
      } finally {
        if (active) setBookmarkLoading(false)
      }
    }

    loadLessonBookmark()

    return () => {
      active = false
    }
  }, [subSectionId, token])

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    )

    if (currentSectionIndex < 0) return true

    const currentSection = courseSectionData[currentSectionIndex]
    const currentSubSectionIndex = currentSection.subSection.findIndex(
      (lesson) => lesson._id === subSectionId
    )

    return currentSectionIndex === 0 && currentSubSectionIndex === 0
  }

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    )

    if (currentSectionIndex < 0) return true

    const currentSection = courseSectionData[currentSectionIndex]
    const currentSubSectionIndex = currentSection.subSection.findIndex(
      (lesson) => lesson._id === subSectionId
    )

    return (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === currentSection.subSection.length - 1
    )
  }

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    )

    if (currentSectionIndex < 0) return

    const currentSection = courseSectionData[currentSectionIndex]
    const currentSubSectionIndex = currentSection.subSection.findIndex(
      (lesson) => lesson._id === subSectionId
    )

    if (currentSubSectionIndex < currentSection.subSection.length - 1) {
      const nextLesson =
        currentSection.subSection[currentSubSectionIndex + 1]

      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextLesson._id}`
      )
      return
    }

    const nextSection = courseSectionData[currentSectionIndex + 1]

    if (nextSection?.subSection?.length) {
      navigate(
        `/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSection.subSection[0]._id}`
      )
    }
  }

  const goToPrevVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    )

    if (currentSectionIndex < 0) return

    const currentSection = courseSectionData[currentSectionIndex]
    const currentSubSectionIndex = currentSection.subSection.findIndex(
      (lesson) => lesson._id === subSectionId
    )

    if (currentSubSectionIndex > 0) {
      const previousLesson =
        currentSection.subSection[currentSubSectionIndex - 1]

      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${previousLesson._id}`
      )
      return
    }

    const previousSection = courseSectionData[currentSectionIndex - 1]

    if (previousSection?.subSection?.length) {
      const previousLesson =
        previousSection.subSection[previousSection.subSection.length - 1]

      navigate(
        `/view-course/${courseId}/section/${previousSection._id}/sub-section/${previousLesson._id}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)

    try {
      const result = await markLectureAsComplete(
        { courseId, subsectionId: subSectionId },
        token
      )

      if (result) {
        dispatch(updateCompletedLectures(subSectionId))
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not update lecture completion"
      )
    } finally {
      setLoading(false)
    }
  }

  // Save the bookmark state for this lesson.
  const handleBookmarkToggle = async () => {
    if (!token || !subSectionId) {
      toast.error("Please log in to bookmark lessons")
      return
    }

    if (bookmarkSaving) return

    const nextState = !isBookmarked
    setBookmarkSaving(true)

    try {
      const saved = await saveLessonBookmark(
        subSectionId,
        { isBookmarked: nextState },
        token
      )

      setIsBookmarked(Boolean(saved.isBookmarked))
      toast.success(
        saved.isBookmarked ? "Lesson bookmarked" : "Bookmark removed"
      )
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not update bookmark"
      )
    } finally {
      setBookmarkSaving(false)
    }
  }

  // Save the student's personal notes.
  const handleSaveNotes = async () => {
    if (!token || !subSectionId) {
      toast.error("Please log in to save notes")
      return
    }

    setNotesSaving(true)

    try {
      const saved = await saveLessonBookmark(
        subSectionId,
        { notes, isBookmarked },
        token
      )

      setNotes(saved.notes || "")
      setIsBookmarked(Boolean(saved.isBookmarked))
      toast.success("Notes saved successfully")
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not save notes"
      )
    } finally {
      setNotesSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Course preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData.videoUrl}
        >
          <BigPlayButton position="center" />

          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={handleLectureCompletion}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}

              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef.current) {
                    playerRef.current.seek(0)
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />

              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}

                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}

      <h1 className="mt-4 text-3xl font-semibold">
        {videoData?.title}
      </h1>

      <p className="pb-6 pt-2">{videoData?.description}</p>

      {/* Bookmark and personal notes */}
      {videoData && (
        <section className="rounded-xl border border-richblack-700 bg-richblack-800 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                Lesson Bookmark & Notes
              </h2>
              <p className="mt-1 text-sm text-richblack-300">
                Save this lesson and keep your own revision notes.
              </p>
            </div>

            <button
              type="button"
              disabled={bookmarkLoading || bookmarkSaving}
              onClick={handleBookmarkToggle}
              className="rounded-lg border border-yellow-50 px-4 py-2.5 font-medium text-yellow-50 transition hover:bg-yellow-50 hover:text-richblack-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bookmarkSaving
                ? "Saving..."
                : isBookmarked
                  ? "★ Bookmarked"
                  : "☆ Bookmark Lesson"}
            </button>
          </div>

          <div className="mt-6">
            <label
              htmlFor="lesson-notes"
              className="mb-2 block text-sm font-medium text-richblack-100"
            >
              My Personal Notes
            </label>

            <textarea
              id="lesson-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={5000}
              rows={5}
              placeholder="Write key concepts, examples, questions, or points to revise..."
              disabled={bookmarkLoading}
              className="w-full rounded-lg border border-richblack-600 bg-richblack-700 px-3 py-3 text-sm text-richblack-5 outline-none focus:border-yellow-50 disabled:opacity-50"
            />

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-richblack-300">
                {notes.length}/5000 characters
              </p>

              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={bookmarkLoading || notesSaving}
                className="rounded-lg bg-yellow-50 px-5 py-2.5 font-semibold text-richblack-900 transition hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {notesSaving ? "Saving Notes..." : "Save Notes"}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default VideoDetails