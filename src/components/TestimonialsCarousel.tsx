
import React, { useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';

const testimonials = [
  {
    quote: "Power BI Assistant is the future of Enterprise Power BI model development. Power BI Assistant makes day to day development and management a dream addressing the issues that have plagued analytical development for years.",
    author: "Christopher Wagner",
    title: "MBA, MVP",
    company: "Power BI Specialist"
  },
  {
    quote: "These days you have to be fast, to be fast enough you have to use fast tools and for sure Power BI Assistant is one of them!",
    author: "Arman Falah",
    title: "CEO",
    company: "Power BI Expert"
  },
  {
    quote: "Going from the legacy Power BI model to Power BI Assistant felt like almost as big a leap as the jump from developing in Power BI Desktop to the first model analyzer! So many amazing additional features, robust AutoComplete, configurable work environment, and too many more to list!",
    author: "Reid Havens",
    title: "Founder | BI Evangelist",
    company: "Power BI Solutions"
  }
];

const TestimonialsCarousel = () => {
  const autoplayPlugin = React.useMemo(() => 
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }), 
  []);

  return (
    <div className="py-24 px-4 bg-muted/20">
      <h2 className="text-4xl font-semibold mb-12 text-center">
        Why our customers love Power BI Assistant
      </h2>
      
      <div className="max-w-7xl mx-auto relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin]}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="h-full p-6">
                  <div className="bg-background/50 backdrop-blur-sm rounded-lg p-8 h-full border shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                    <blockquote className="text-lg mb-6 text-muted-foreground">
                      "{testimonial.quote}"
                    </blockquote>
                    <footer className="mt-auto">
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                    </footer>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
