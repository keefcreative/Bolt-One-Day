"use client";
import React, { useState, useMemo } from "react";
import { ChevronDown, Search } from 'lucide-react';
import premiumFaqData from '@/data/premiumFaq.json'

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

interface FaqCategory {
  id: string;
  name: string;
  count: number;
}

export function PremiumFaq() {
  const { title, subtitle, items } = premiumFaqData
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('subscription');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Generate categories from items
  const categories: FaqCategory[] = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    items.forEach(item => {
      categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
    });

    return Array.from(categoryMap.entries()).map(([id, count]) => ({
      id,
      name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      count
    }));
  }, [items]);

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by category (always filter since we removed 'all')
    filtered = filtered.filter(item => item.category === activeCategory);

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(query) || 
        item.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [items, activeCategory, searchQuery]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setOpenIndex(null); // Close any open FAQ when switching categories
    setClickedIndex(null); // Reset clicked state
  };

  const handleQuestionClick = (index: number) => {
    if (clickedIndex === index) {
      // If already clicked, close it
      setClickedIndex(null);
      setOpenIndex(null);
    } else {
      // Click to open and keep open
      setClickedIndex(index);
      setOpenIndex(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    // Only show on hover if not already clicked open
    if (clickedIndex !== index) {
      setOpenIndex(index);
    }
  };

  const handleMouseLeave = () => {
    // Only hide on mouse leave if it wasn't clicked open
    if (clickedIndex === null) {
      setOpenIndex(null);
    }
  };

  return (
    <section className="py-16 md:py-24 lg:py-28 bg-pearl">
      <div className="max-w-[1600px] mx-auto px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="mb-3 font-medium text-flame text-[0.875rem] tracking-[0.1em] uppercase md:mb-4">
              FAQ
            </p>
            <h2 className="text-[3.5rem] font-light tracking-[-0.03em] leading-[1.2] text-ink mb-6">
              {title}
            </h2>
            <p className="text-lg font-light text-smoke leading-[1.6] mb-8">
              {subtitle}
            </p>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ash" strokeWidth={1.2} />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-mist rounded-lg bg-white text-ink placeholder-ash focus:outline-none focus:border-flame focus:ring-1 focus:ring-flame/20 transition-colors"
              />
            </div>

            {/* Category Navigation */}
            <div className="flex flex-wrap gap-3 mb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-flame text-white'
                      : 'bg-white text-smoke hover:bg-flame hover:text-white border border-mist'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className={`px-2 py-0.5 text-xs ${
                    activeCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-silk text-ash'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((faq, index) => (
                <div key={`${activeCategory}-${index}`} className="border border-mist bg-white rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuestionClick(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-silk transition-colors duration-300"
                  >
                    <span className="font-medium text-ink pr-4">{faq.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${
                        openIndex === index ? 'rotate-180 text-flame' : 'text-ash'
                      }`} 
                      strokeWidth={1.2}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6 border-t border-silk" onMouseLeave={handleMouseLeave}>
                      <div className="pt-4">
                        <p className="font-light text-smoke leading-[1.6]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white border border-mist rounded-lg">
                <p className="text-ash font-light">
                  No questions found matching your search.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('subscription');
                    setClickedIndex(null);
                    setOpenIndex(null);
                  }}
                  className="mt-3 text-flame hover:text-ember font-medium transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Load More Button (if you want to implement pagination) */}
            {filteredItems.length > 6 && (
              <div className="text-center pt-6">
                <button className="px-6 py-3 border-2 border-flame text-flame hover:bg-flame hover:text-white transition-all duration-200 rounded-lg font-medium">
                  Load More Questions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Example usage with categorized FAQ data
export const faqData: FaqItem[] = [
  // General Questions
  {
    question: "How does the design subscription work?",
    answer: "Our design subscription gives you unlimited access to professional design services. Simply submit requests through your client portal, and our team will deliver high-quality designs within 48-72 hours.",
    category: "general"
  },
  {
    question: "What types of design work do you cover?",
    answer: "We handle all types of design work including logos, brand identity, website design, marketing materials, social media graphics, print design, and more. If it's design-related, we can help.",
    category: "general"
  },
  {
    question: "Do you work with my existing brand guidelines?",
    answer: "Absolutely! We work within your existing brand guidelines and style requirements. Just share your brand assets and guidelines when onboarding, and we'll ensure all designs stay consistent with your brand.",
    category: "general"
  },

  // Subscription Questions
  {
    question: "What's included in my subscription?",
    answer: "Your subscription includes unlimited design requests, dedicated account management, 48-72 hour turnaround, unlimited revisions, and access to our client portal for easy project management.",
    category: "subscription"
  },
  {
    question: "Can I pause or cancel my subscription?",
    answer: "Yes, you can pause your subscription at any time if you don't need design work temporarily. You can also cancel with 30 days notice. There are no long-term contracts or cancellation fees.",
    category: "subscription"
  },
  {
    question: "How many requests can I submit at once?",
    answer: "You can submit unlimited requests, but we work on them one at a time to ensure quality and focus. Once one request is completed, we'll automatically start on the next in your queue.",
    category: "subscription"
  },

  // Design Process Questions
  {
    question: "How fast will I receive my designs?",
    answer: "Most design requests are completed within 48-72 hours. More complex projects may take longer, but we'll always communicate timelines upfront and keep you updated throughout the process.",
    category: "design-process"
  },
  {
    question: "What if I don't like the design?",
    answer: "We offer unlimited revisions until you're completely happy with the result. We'll work with your feedback to refine the design until it meets your expectations perfectly.",
    category: "design-process"
  },
  {
    question: "How do I submit design requests?",
    answer: "Simply use our client portal to submit requests with detailed briefs, reference materials, and any specific requirements. You can also schedule calls with your account manager for more complex projects.",
    category: "design-process"
  },

  // Billing Questions
  {
    question: "How does billing work?",
    answer: "We bill monthly in advance. Your subscription automatically renews each month, and you'll receive an invoice via email. We accept all major credit cards and bank transfers.",
    category: "billing"
  },
  {
    question: "Are there any setup fees?",
    answer: "No setup fees! You only pay the monthly subscription rate. We believe in transparent, straightforward pricing with no hidden costs or surprise charges.",
    category: "billing"
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades will apply at your next billing cycle. We'll prorate any differences accordingly.",
    category: "billing"
  }
];