import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  ChevronLeft,
  ChevronRight,
  Menu,
  Heart,
  MessageCircle,
  Share,
  X,
  Play,
  SkipForward
} from "lucide-react"

interface SlideReaderProps {
  story: any
  onNavigate: (page: string, data?: any) => void
}

export function SlideReader({ story, onNavigate }: SlideReaderProps) {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [showMenu, setShowMenu] = useState(false)
  const [showAd, setShowAd] = useState(false)
  const [adCountdown, setAdCountdown] = useState(5)
  const [isLiked, setIsLiked] = useState(false)

  const totalSlides = 24
  const progress = Math.round((currentSlide / totalSlides) * 100)

  const slides = [
    {
      content: "The city never slept, but tonight it seemed to pulse with an otherworldly energy. Neon lights flickered in patterns that Maya had never noticed before, creating a rhythm that matched her racing heartbeat. She paused at the intersection, watching the streams of data that now seemed visible in the air around her."
    },
    {
      content: "The enhancement had worked, perhaps too well. What Dr. Chen had promised would be a simple cognitive boost had unleashed something far more complex. Maya could see the digital infrastructure of the city laid bare before her eyes - fiber optic cables pulsing with light beneath the streets, wireless signals dancing between buildings like aurora borealis."
    },
    {
      content: "Her phone buzzed with a message from an unknown number: 'They know what you can see now. Run.' Maya's enhanced vision immediately traced the signal's path, revealing it had bounced through seventeen different servers across three continents before reaching her device. Someone was being very careful to stay hidden."
    }
    // Add more slides as needed
  ]

  // Show ad every 6 slides
  useEffect(() => {
    if (currentSlide % 6 === 0 && currentSlide > 0) {
      setShowAd(true)
      setAdCountdown(5)
    }
  }, [currentSlide])

  // Ad countdown
  useEffect(() => {
    if (showAd && adCountdown > 0) {
      const timer = setTimeout(() => setAdCountdown(adCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [showAd, adCountdown])

  const nextSlide = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const skipAd = () => {
    setShowAd(false)
    setAdCountdown(5)
  }

  const handleSlideNavigation = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    
    if (x > width * 0.7) {
      nextSlide() // Right 30% - next slide
    } else if (x < width * 0.3) {
      prevSlide() // Left 30% - previous slide
    } else {
      setShowMenu(!showMenu) // Center 40% - toggle menu
    }
  }

  if (showAd) {
    return (
      <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="relative max-w-2xl w-full mx-4">
          <div className="bg-background border rounded-lg p-8 text-center space-y-6">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Play className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Advertisement</h3>
              <p className="text-muted-foreground">
                Supporting VineNovel with a short message
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6">
              <p className="text-lg font-medium">
                Discover amazing stories on VineNovel Premium
              </p>
              <p className="text-muted-foreground mt-2">
                Ad-free reading experience with exclusive content
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={skipAd}
                disabled={adCountdown > 0}
                className="min-w-32"
              >
                {adCountdown > 0 ? (
                  <>Skip in {adCountdown}s</>
                ) : (
                  <>
                    <SkipForward className="h-4 w-4 mr-2" />
                    Skip Ad
                  </>
                )}
              </Button>
              <Button className="vine-button-hero">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background z-40">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      {/* Menu Overlay */}
      {showMenu && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="max-w-md w-full mx-4 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{story?.title || "The Digital Awakening"}</h2>
              <p className="text-muted-foreground">by {story?.author || "Sarah Chen"}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Slide {currentSlide} of {totalSlides} • {progress}% complete
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => onNavigate("library")}
                className="h-16 flex-col gap-2"
              >
                <MessageCircle className="h-6 w-6" />
                Library
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate("settings")}
                className="h-16 flex-col gap-2"
              >
                <Menu className="h-6 w-6" />
                Settings
              </Button>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                size="sm"
                variant={isLiked ? "default" : "outline"}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button size="sm" variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Comment
              </Button>
              <Button size="sm" variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowMenu(false)}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              Close Menu
            </Button>
          </div>
        </div>
      )}

      {/* Main Reading Area */}
      <div 
        className="h-full w-full flex items-center justify-center cursor-pointer select-none"
        onClick={handleSlideNavigation}
      >
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="prose prose-lg lg:prose-xl max-w-none text-center">
            <p className="text-xl lg:text-2xl leading-relaxed">
              {slides[Math.min(currentSlide - 1, slides.length - 1)]?.content}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Hints */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          <span>Tap left</span>
        </div>
        <div className="w-px h-4 bg-border"></div>
        <div className="flex items-center gap-2">
          <Menu className="h-4 w-4" />
          <span>Tap center</span>
        </div>
        <div className="w-px h-4 bg-border"></div>
        <div className="flex items-center gap-2">
          <span>Tap right</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      {/* Exit Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate("discover")}
        className="absolute top-4 left-4 z-10"
      >
        <X className="h-4 w-4 mr-2" />
        Exit
      </Button>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 z-10 bg-background/80 rounded-full px-3 py-1 text-sm">
        {currentSlide} / {totalSlides}
      </div>
    </div>
  )
}