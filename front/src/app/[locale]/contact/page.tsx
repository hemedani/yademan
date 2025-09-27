// Purpose: Static contact page with contact form and company information

import { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import TraditionalLayout from "@/components/layout/TraditionalLayout";

export const metadata: Metadata = {
  title: "Contact Us - Yademan",
  description:
    "Get in touch with the Yademan team. We'd love to hear from you!",
};

export default function ContactPage() {
  return (
    <TraditionalLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Contact Us
              </h1>
              <p className="text-xl text-gray-600">
                We&apos;d love to hear from you. Send us a message and
                we&apos;ll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Send us a message
                  </h2>
                  <ContactForm />
                </div>

                {/* Contact Information */}
                <div>
                  <ContactInfo />

                  {/* FAQ Section */}
                  <div className="mt-12 bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          How do I add a new location?
                        </h4>
                        <p className="text-gray-600">
                          You can add new locations by clicking on any point on
                          the map while logged in to your account.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Can I edit location information?
                        </h4>
                        <p className="text-gray-600">
                          Yes, registered users can suggest edits to location
                          information. All changes are reviewed before being
                          published.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Is my data secure?
                        </h4>
                        <p className="text-gray-600">
                          We take privacy seriously and use industry-standard
                          security measures to protect your personal
                          information.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </TraditionalLayout>
  );
}
