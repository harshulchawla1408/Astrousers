'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQAccordion = () => {
  const faqs = [
    {
      question: "How accurate are Astrousers' birth charts?",
      answer: "Our charts use precise astronomical algorithms and birth-time calculations. Accuracy improves with exact birth time & location; we show uncertainty ranges if birth time is approximate."
    },
    {
      question: "How do I choose an astrologer?",
      answer: "Filter by specialty, rating, languages, and availability. Each profile includes a short intro video and verified reviews."
    },
    {
      question: "Are consultations confidential?",
      answer: "Yes. All consultations and data are encrypted. We never share your personal details without consent."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We offer a satisfaction policy—contact support within 48 hours for case review and potential refund or re-consultation."
    },
    {
      question: "Do you offer remedies or only predictions?",
      answer: "Both. Our astrologers provide practical remedies, lifestyle changes, and gemstone suggestions where relevant."
    },
    {
      question: "What payment methods do you accept?",
      answer: "Major cards, UPI, PayPal, and in-app wallets. Receipt emailed for every transaction."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A1A2F] mb-4">
            Frequently Asked <span className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-xl text-[#0A1A2F]/70 max-w-2xl mx-auto">
            Find answers to common questions about our astrology services and platform
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-[#E5E5E5] rounded-xl px-6 py-2 hover:border-[#FFA726] transition-colors duration-200 bg-white"
            >
              <AccordionTrigger className="text-left hover:no-underline hover:text-[#FFA726] transition-colors duration-200">
                <span className="font-semibold text-[#0A1A2F]">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-[#0A1A2F]/70 leading-relaxed pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Additional Help */}
        <div className="mt-16 text-center bg-[#FFF7E6] rounded-[20px] p-8 border border-[#FFD56B]/30">
          <h3 className="text-2xl font-bold text-[#0A1A2F] mb-4">Still have questions?</h3>
          <p className="text-[#0A1A2F]/70 mb-6">
            Our support team is here to help you 24/7. Get in touch with us for any queries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] hover:from-[#FF8F00] hover:to-[#FFA726] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Contact Support
            </button>
            <button 
              className="border border-[#0A1A2F] text-[#0A1A2F] hover:bg-[#0A1A2F] hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
