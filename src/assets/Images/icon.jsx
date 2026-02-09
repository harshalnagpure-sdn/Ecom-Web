// Icon.jsx
import React from "react";

// All your icons stored as components
const icons = {
  globicon: (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 27.5C21.9036 27.5 27.5 21.9036 27.5 15C27.5 8.09644 21.9036 2.5 15 2.5C8.09644 2.5 2.5 8.09644 2.5 15C2.5 21.9036 8.09644 27.5 15 27.5Z"
        stroke="#C98A5C"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 2.5C11.7903 5.87019 10 10.3459 10 15C10 19.6541 11.7903 24.1298 15 27.5C18.2097 24.1298 20 19.6541 20 15C20 10.3459 18.2097 5.87019 15 2.5Z"
        stroke="#C98A5C"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 15H27.5"
        stroke="#C98A5C"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Example for future icons
  lawIcon: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 20L23.75 10L27.5 20C26.4125 20.8125 25.1 21.25 23.75 21.25C22.4 21.25 21.0875 20.8125 20 20Z" stroke="#C98A5C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.5 20L6.25 10L10 20C8.9125 20.8125 7.6 21.25 6.25 21.25C4.9 21.25 3.5875 20.8125 2.5 20Z" stroke="#C98A5C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.75 26.25H21.25" stroke="#C98A5C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 3.75V26.25" stroke="#C98A5C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.75 8.75H6.25C8.75 8.75 12.5 7.5 15 6.25C17.5 7.5 21.25 8.75 23.75 8.75H26.25" stroke="#C98A5C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  ),
   saveIcon: (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.75 2.5H7.5C6.83696 2.5 6.20107 2.76339 5.73223 3.23223C5.26339 3.70107 5 4.33696 5 5V25C5 25.663 5.26339 26.2989 5.73223 26.7678C6.20107 27.2366 6.83696 27.5 7.5 27.5H22.5C23.163 27.5 23.7989 27.2366 24.2678 26.7678C24.7366 26.2989 25 25.663 25 25V8.75L18.75 2.5Z" stroke="#C98A5C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.5 2.5V7.5C17.5 8.16304 17.7634 8.79893 18.2322 9.26777C18.7011 9.73661 19.337 10 20 10H25" stroke="#C98A5C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.25 18.75L13.75 21.25L18.75 16.25" stroke="#C98A5C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
   ),
   profileIcon: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 26.25V23.75C20 22.4239 19.4732 21.1521 18.5355 20.2145C17.5979 19.2768 16.3261 18.75 15 18.75H7.5C6.17392 18.75 4.90215 19.2768 3.96447 20.2145C3.02678 21.1521 2.5 22.4239 2.5 23.75V26.25" stroke="#C98A5C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.25 13.75C14.0114 13.75 16.25 11.5114 16.25 8.75C16.25 5.98858 14.0114 3.75 11.25 3.75C8.48858 3.75 6.25 5.98858 6.25 8.75C6.25 11.5114 8.48858 13.75 11.25 13.75Z" stroke="#C98A5C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M27.5 26.2496V23.7496C27.4992 22.6418 27.1304 21.5656 26.4517 20.69C25.773 19.8144 24.8227 19.1891 23.75 18.9121" stroke="#C98A5C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 3.91211C21.0755 4.18749 22.0288 4.81299 22.7095 5.69C23.3903 6.56701 23.7598 7.64565 23.7598 8.75586C23.7598 9.86607 23.3903 10.9447 22.7095 11.8217C22.0288 12.6987 21.0755 13.3242 20 13.5996" stroke="#C98A5C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

   ),
   Transparent:(
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.43621 20.5796C3.29731 20.2054 3.29731 19.7938 3.43621 19.4196C4.78904 16.1394 7.0854 13.3347 10.0342 11.3611C12.9829 9.38755 16.4513 8.33398 19.9995 8.33398C23.5478 8.33398 27.0162 9.38755 29.9649 11.3611C32.9137 13.3347 35.21 16.1394 36.5629 19.4196C36.7018 19.7938 36.7018 20.2054 36.5629 20.5796C35.21 23.8599 32.9137 26.6646 29.9649 28.6381C27.0162 30.6117 23.5478 31.6653 19.9995 31.6653C16.4513 31.6653 12.9829 30.6117 10.0342 28.6381C7.0854 26.6646 4.78904 23.8599 3.43621 20.5796Z" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 25C22.7614 25 25 22.7614 25 20C25 17.2386 22.7614 15 20 15C17.2386 15 15 17.2386 15 20C15 22.7614 17.2386 25 20 25Z" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
   ),
   Private:(
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.0001 16.667C19.116 16.667 18.2682 17.0182 17.643 17.6433C17.0179 18.2684 16.6667 19.1163 16.6667 20.0003C16.6667 21.7003 16.5001 24.1837 16.2334 26.667" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.3337 21.8662C23.3337 25.8329 23.3337 32.4995 21.667 36.6662" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M28.8164 35.0333C29.0164 34.0333 29.5331 31.2 29.6497 30" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.33301 19.9997C3.33301 16.5016 4.43363 13.0923 6.47897 10.2545C8.52431 7.41674 11.4107 5.29446 14.7292 4.18829C18.0477 3.08211 21.6302 3.04811 24.9691 4.09112C28.3081 5.13412 31.2342 7.20124 33.333 9.99967" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.33301 26.667H3.34967" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M36.333 26.667C36.6663 23.3337 36.5513 17.7437 36.333 16.667" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.33301 32.5003C9.16634 30.0003 9.99967 25.0003 9.99967 20.0003C9.99799 18.8651 10.1896 17.7379 10.5663 16.667" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.417 36.6663C14.767 35.5663 15.167 34.4663 15.367 33.333" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 11.3329C16.5207 10.455 18.2457 9.99288 20.0016 9.99316C21.7575 9.99345 23.4824 10.4561 25.0028 11.3345C26.5232 12.213 27.7854 13.4762 28.6627 14.9973C29.5399 16.5184 30.0011 18.2437 30 19.9996V23.3329" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

   ),
   Sustainable:(
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.6666 31.6663H8.02494C7.49922 31.6679 6.98203 31.5335 6.52356 31.2762C6.06509 31.0189 5.6809 30.6475 5.40827 30.198C5.14646 29.7465 5.00801 29.2341 5.00684 28.7122C5.00567 28.1903 5.14182 27.6773 5.4016 27.2247L11.9933 15.833" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.333 31.6664H32.0047C32.5279 31.6624 33.0412 31.5238 33.4954 31.264C33.9496 31.0042 34.3293 30.632 34.598 30.1831C34.8562 29.7329 34.992 29.2229 34.992 28.7039C34.992 28.1849 34.8562 27.675 34.598 27.2247L32.5547 23.6914" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.333 26.667L18.333 31.667L23.333 36.667" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.822 22.6597L11.9937 15.833L5.16699 17.663" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.5732 9.68501L17.3949 6.53167C17.6565 6.07567 18.0315 5.69502 18.4835 5.42665C18.9356 5.15828 19.4493 5.01132 19.9749 5.00001C20.4965 4.99903 21.0091 5.13527 21.4614 5.39505C21.9136 5.65482 22.2896 6.02899 22.5516 6.48001L29.1232 17.885" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22.2969 16.0553L29.1235 17.8853L30.9519 11.0586" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
   ),
   Inclusive: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.6667 8.33333C27.5871 8.33333 28.3333 7.58714 28.3333 6.66667C28.3333 5.74619 27.5871 5 26.6667 5C25.7462 5 25 5.74619 25 6.66667C25 7.58714 25.7462 8.33333 26.6667 8.33333Z" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30.0003 31.6667L31.667 20L21.667 21.6667" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.33301 13.333L13.333 8.33301L22.4997 13.333L18.5663 19.1663" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.06714 24.167C6.59687 25.7054 6.58195 27.3471 7.02417 28.8938C7.46639 30.4406 8.34685 31.8262 9.55927 32.8836C10.7717 33.9409 12.2642 34.6247 13.8567 34.8525C15.4492 35.0802 17.0736 34.8421 18.5338 34.167" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22.9335 29.1669C23.4037 27.6284 23.4187 25.9868 22.9764 24.44C22.5342 22.8933 21.6538 21.5076 20.4413 20.4503C19.2289 19.3929 17.7364 18.7091 16.1439 18.4814C14.5514 18.2537 12.927 18.4917 11.4668 19.1669" stroke="#F5F1EB" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

   ),
   chatIcon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1567_5987)">
<path d="M5.26732 13.3337C6.5397 13.9864 8.00337 14.1632 9.39458 13.8322C10.7858 13.5012 12.013 12.6842 12.8552 11.5285C13.6973 10.3727 14.0989 8.95416 13.9877 7.52846C13.8765 6.10277 13.2597 4.76367 12.2485 3.75249C11.2373 2.7413 9.89824 2.12452 8.47254 2.0133C7.04684 1.90208 5.6283 2.30372 4.47253 3.14585C3.31676 3.98799 2.49978 5.21523 2.1688 6.60643C1.83782 7.99763 2.01461 9.46131 2.66732 10.7337L1.33398 14.667L5.26732 13.3337Z" stroke="#1A1A1A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1567_5987">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>

   ),
};

const Icon = ({ name, className }) => {
  // Render the requested icon or null if not found
  return <span className={className}>{icons[name] || null}</span>;
};

export default Icon;
