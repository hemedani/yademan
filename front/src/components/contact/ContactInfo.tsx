'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const ContactInfo: React.FC = () => {
  const t = useTranslations('Contact');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contactInformation')}</h2>

      <div className="space-y-6">
        {/* Address */}
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{t('address')}</h3>
            <p className="mt-1 text-gray-600">
              {t('addressValue')}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{t('phone')}</h3>
            <p className="mt-1 text-gray-600">
              <a href="tel:+98-21-12345678" className="hover:text-blue-600">
                {t('phoneValue')}
              </a>
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{t('email')}</h3>
            <p className="mt-1 text-gray-600">
              <a href="mailto:info@yademan.ir" className="hover:text-blue-600">
                {t('emailValue')}
              </a>
            </p>
          </div>
        </div>

        {/* Working Hours */}
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{t('workingHours')}</h3>
            <p className="mt-1 text-gray-600">
              {t('workingHoursValue')}
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('followUs')}</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
            >
              <span className="sr-only">Instagram</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12.017 0C8.396 0 7.929.013 6.71.072 5.493.131 4.67.333 3.985.63c-.696.302-1.299.703-1.892 1.296C1.5 2.519 1.099 3.122.797 3.818c-.297.685-.499 1.508-.558 2.725C.178 7.764.165 8.231.165 11.852c0 3.621.013 4.088.072 5.307.059 1.217.261 2.04.558 2.725.302.696.703 1.299 1.296 1.892.593.593 1.196.994 1.892 1.296.685.297 1.508.499 2.725.558 1.219.059 1.686.072 5.307.072 3.621 0 4.088-.013 5.307-.072 1.217-.059 2.04-.261 2.725-.558.696-.302 1.299-.703 1.892-1.296.593-.593.994-1.196 1.296-1.892.297-.685.499-1.508.558-2.725.059-1.219.072-1.686.072-5.307 0-3.621-.013-4.088-.072-5.307-.059-1.217-.261-2.04-.558-2.725-.302-.696-.703-1.299-1.296-1.892C20.71 1.5 20.107 1.099 19.411.797c-.685-.297-1.508-.499-2.725-.558C15.467.178 15 .165 11.379.165L12.017 0zm-.062 2.165c3.551 0 3.971.014 5.369.072 1.296.059 2.003.275 2.472.458.621.242 1.065.532 1.532.999.467.467.757.911.999 1.532.183.469.399 1.176.458 2.472.058 1.398.072 1.818.072 5.369s-.014 3.971-.072 5.369c-.059 1.296-.275 2.003-.458 2.472-.242.621-.532 1.065-.999 1.532-.467.467-.911.757-1.532.999-.469.183-1.176.399-2.472.458-1.398.058-1.818.072-5.369.072s-3.971-.014-5.369-.072c-1.296-.059-2.003-.275-2.472-.458-.621-.242-1.065-.532-1.532-.999-.467-.467-.757-.911-.999-1.532-.183-.469-.399-1.176-.458-2.472-.058-1.398-.072-1.818-.072-5.369s.014-3.971.072-5.369c.059-1.296.275-2.003.458-2.472.242-.621.532-1.065.999-1.532.467-.467.911-.757 1.532-.999.469-.183 1.176-.399 2.472-.458 1.398-.058 1.818-.072 5.369-.072z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
            >
              <span className="sr-only">Telegram</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
            >
              <span className="sr-only">Twitter</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
