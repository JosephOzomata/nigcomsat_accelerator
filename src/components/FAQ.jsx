import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is the NIGCOMSAT Accelerator Program?",
    answer:
      "The NIGCOMSAT Accelerator Program is an innovation initiative designed to support startups, entrepreneurs, and innovators by providing mentorship, training, networking opportunities, and access to resources that help scale technology-driven businesses."
  },
  {
    question: "Who can apply?",
    answer:
      "The program is open to Nigerian startups, entrepreneurs, and innovators with scalable ideas or early-stage businesses that align with technology and innovation."
  },
  {
    question: "Is the program free?",
    answer:
      "Yes. Eligible participants can join the accelerator without paying participation fees, subject to the program's terms and selection process."
  },
  {
    question: "How long does the accelerator run?",
    answer:
      "The program typically runs over several weeks and includes workshops, mentorship sessions, networking events, and a demo day."
  },
  {
    question: "Will participants receive funding?",
    answer:
      "The accelerator may provide opportunities to pitch to investors and funding partners, although funding is not guaranteed for every participant."
  },
  {
    question: "How do I apply?",
    answer:
      "Applications are submitted through the official NIGCOMSAT Accelerator Program website during the application period."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="uppercase tracking-[0.3em] text-sm text-gray-400 mb-3">
            Support
          </p>

          <h2 className="text-4xl md:text-5xl font-bold">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Everything you need to know about the NIGCOMSAT Accelerator Program.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border border-white/15 rounded-2xl bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/30"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-medium pr-4">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center border-t border-white/10 pt-8">
          <p className="text-gray-400">
            Still have questions?
          </p>

          <button className="mt-4 px-6 py-3 border border-white rounded-full hover:bg-white hover:text-black transition-colors duration-300">
            Contact the Team
          </button>
        </div>
      </div>
    </section>
  );
}