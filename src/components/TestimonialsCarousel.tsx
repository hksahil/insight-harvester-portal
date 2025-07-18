import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote: "When I first opened our 300‑measure retail model at NorthStar Retail, I felt overwhelmed—until PowerBI Assistant's Model Analysis mapped out every table, column, and relationship in seconds. I actually understood our data lineage for the first time, which saved me two full days of manual documentation.",
    author: "Anita Desai",
    title: "Lead BI Analyst"
  },
  {
    quote: "Last quarter we rolled out inventory dashboards at HomeSync Inc. PowerBI Assistant's Best Practices checker flagged high‑cardinality columns and unused relationships I'd overlooked—and the built‑in AI Assistant even suggested a star‑schema fix that cut load times in half",
    author: "Jitesh Mishra",
    title: "Analytics Manager"
  },
  {
    quote: "I'm the sole BI developer at my project, and documentation always fell to the bottom of my to‑do list. With PowerBI Assistant's one‑click Documentation, I now hand over fully annotated model docs to our auditors in under five minutes—no frantic late‑night edits required.",
    author: "Priya Kumari",
    title: "PBI Developer"
  },
  {
    quote: "Impact Analysis let me see exactly which measures would break before I even hit 'Publish' ",
    author: "Sunita Rao",
    title: "Analytics Manager"
  }
];

const TestimonialsCarousel = () => {
  return (
    <div className="px-4 bg-muted/20">
      <h2 className="text-4xl font-semibold mb-12 md:text-center text-left">
        Why the BI community love Power BI Assistant
      </h2>
      <div className="relative max-w-xl md:max-w-7xl w-full px-7 md:px-0 mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="h-full md:p-6">
                  <div className="bg-background/50 backdrop-blur-sm rounded-lg p-8 h-full border shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                    <blockquote className="text-lg mb-6 text-muted-foreground">
                      "{testimonial.quote}"
                    </blockquote>
                    <footer className="mt-auto">
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                    </footer>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <div className="pointer-events-auto"> */}
          <CarouselPrevious />
          {/* </div> */}
          {/* <div className="pointer-events-auto"> */}
          <CarouselNext />
          {/* </div> */}
        </Carousel>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;