export const QuoteIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" className="ml-1">
    <path
      d="M21.75 11H18V8C18 6.34531 19.3453 5 21 5H21.375C21.9984 5 22.5 4.49844 22.5 3.875V1.625C22.5 1.00156 21.9984 0.5 21.375 0.5H21C16.8562 0.5 13.5 3.85625 13.5 8V19.25C13.5 20.4922 14.5078 21.5 15.75 21.5H21.75C22.9922 21.5 24 20.4922 24 19.25V13.25C24 12.0078 22.9922 11 21.75 11ZM8.25 11H4.5V8C4.5 6.34531 5.84531 5 7.5 5H7.875C8.49844 5 9 4.49844 9 3.875V1.625C9 1.00156 8.49844 0.5 7.875 0.5H7.5C3.35625 0.5 0 3.85625 0 8V19.25C0 20.4922 1.00781 21.5 2.25 21.5H8.25C9.49219 21.5 10.5 20.4922 10.5 19.25V13.25C10.5 12.0078 9.49219 11 8.25 11Z"
      fill="url(#quote_icon_gradient)"
    />
    <defs>
      <linearGradient
        id="quote_icon_gradient"
        x1="0"
        y1="0.5"
        x2="25.4157"
        y2="2.38202"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2BC0C9" />
        <stop offset="0.477124" stopColor="#66E7B9" />
        <stop offset="1" stopColor="#35C6B5" />
      </linearGradient>
    </defs>
  </svg>
);
