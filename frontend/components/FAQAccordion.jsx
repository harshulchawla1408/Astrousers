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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our astrology services and platform
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-gray-200 rounded-lg px-6 py-2 hover:border-orange-300 transition-colors duration-200"
            >
              <AccordionTrigger className="text-left hover:no-underline hover:text-orange-600 transition-colors duration-200">
                <span className="font-semibold text-gray-900">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Additional Help */}
        <div className="mt-16 text-center bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you 24/7. Get in touch with us for any queries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              data-cursor="pointer"
            >
              Contact Support
            </button>
            <button 
              className="border border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              data-cursor="pointer"
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
