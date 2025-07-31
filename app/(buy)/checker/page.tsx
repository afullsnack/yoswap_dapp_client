"use client"
import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import Navbar from "components/Navbar/Navbar"
import ArrowLeftIcon from "public/arrow-left"

const Checker: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [livenessCheckPassed, setLivenessCheckPassed] = useState(false)
  const [instructions, setInstructions] = useState("Center your face in the frame")
  const [countdown, setCountdown] = useState(5)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()

  // Initialize camera and face detection
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          streamRef.current = stream
        }

        setLoading(false)
        startFaceDetection()
      } catch (err) {
        console.error("Error accessing camera:", err)
        setError("Camera access denied. Please enable camera permissions.")
        notify("error", "Camera Error", {
          description: "Could not access camera. Please check permissions.",
        })
        setLoading(false)
      }
    }

    initCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [])

  // Simulate face detection (replace with actual face detection logic)
  const startFaceDetection = () => {
    setIsDetecting(true)

    detectionIntervalRef.current = setInterval(() => {
      // This is where you would integrate with a real face detection library
      // For demo purposes, we're simulating detection after 2 seconds
      if (!faceDetected) {
        setFaceDetected(true)
        setInstructions("Perfect! Now perform the action below")
        startLivenessChallenge()
      }
    }, 2000)
  }

  // Simulate liveness challenge
  const startLivenessChallenge = () => {
    const challengeInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(challengeInterval)
          setLivenessCheckPassed(true)
          setInstructions("Liveness check passed!")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!livenessCheckPassed) {
      notify("error", "Complete Liveness Check", {
        description: "Please complete the liveness check before proceeding",
      })
      return
    }

    setLoading(true)

    try {
      // Here you would typically send the captured frames/video to your backend
      // for verification before proceeding

      notify("success", "Verification successful!", {
        description: "Redirecting to dashboard...",
        duration: 1000,
      })
      setTimeout(() => router.push("/bvn"), 1000)
    } catch (error: any) {
      const errorMessage = "Verification failed. Please try again."
      setError(errorMessage)
      notify("error", "Verification failed", {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative flex h-screen flex-col bg-[#110B1F] px-4 py-2 md:px-16 md:py-4">
      <div className="absolute top-14 overflow-hidden">
        <img src="/bg-image.png" alt="Background" />
      </div>

      <Navbar loading={loading} />

      <div className="relative flex w-full flex-col items-center max-sm:mt-10 md:mt-0">
        <div className="flex h-auto rounded-lg bg-[#FFFFFF0F] px-5 py-4 max-sm:w-[95%] md:w-[586px] xl:w-[586px]">
          <div className="w-full justify-center">
            <div className="mb-6 flex cursor-pointer items-center gap-2" onClick={() => router.back()}>
              <ArrowLeftIcon />
              <p className="text-xs text-[#F8F8F8]">Back</p>
            </div>
            <div className="mb-4">
              <h5 className="text-2xl font-medium text-[#F8F8F8]">Liveness check</h5>
              <p className="text-sm text-[#F8F8F8]">
                You're almost there! Center your face in the frame and follow the screen instructions. Make sure it's
                completed by yourself.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="relative flex flex-col items-center justify-center rounded-lg bg-black">
                {/* Camera Feed */}
                <video ref={videoRef} autoPlay playsInline muted className="h-64 w-full rounded-lg object-cover" />

                {/* Overlay instructions */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-center text-white">
                  {instructions}
                  {countdown > 0 && faceDetected && (
                    <div className="mt-1 text-sm">Hold still for {countdown} seconds</div>
                  )}
                </div>

                {/* Canvas for face detection (hidden) */}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <ul className="mb-4 mt-6 list-disc gap-3 pl-5 text-sm text-[#f8f8f8]">
                <li>Take off your glasses, hat or any items that cover your face</li>
                <li className="mt-2">Make sure your face is well-lit</li>
                <li className="mt-2">Follow the on-screen instructions carefully</li>
              </ul>

              <ButtonModule
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading || !livenessCheckPassed}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </div>
                ) : livenessCheckPassed ? (
                  "Continue to Verification"
                ) : (
                  "Complete Liveness Check First"
                )}
              </ButtonModule>
            </form>
          </div>
        </div>
      </div>

      {error && <div className="mt-4 rounded-lg bg-red-500 p-3 text-white">{error}</div>}
    </section>
  )
}

export default Checker
