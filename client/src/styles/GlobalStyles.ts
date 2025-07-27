import { createGlobalStyle } from 'styled-components';
import { Theme } from './theme';

const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .App {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.secondary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary.main};
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary.dark};
    }
  }

  /* Lists */
  ul, ol {
    padding-left: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  li {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  /* Forms */
  input, textarea, select {
    font-family: inherit;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.2s ease;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Utilities */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
      padding: 0 ${({ theme }) => theme.spacing.lg};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      padding: 0 ${({ theme }) => theme.spacing.xl};
    }
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-1 {
    gap: ${({ theme }) => theme.spacing.xs};
  }

  .gap-2 {
    gap: ${({ theme }) => theme.spacing.sm};
  }

  .gap-3 {
    gap: ${({ theme }) => theme.spacing.md};
  }

  .gap-4 {
    gap: ${({ theme }) => theme.spacing.lg};
  }

  .mb-0 {
    margin-bottom: 0;
  }

  .mb-1 {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  .mb-2 {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  .mb-3 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  .mb-4 {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  .mt-0 {
    margin-top: 0;
  }

  .mt-1 {
    margin-top: ${({ theme }) => theme.spacing.xs};
  }

  .mt-2 {
    margin-top: ${({ theme }) => theme.spacing.sm};
  }

  .mt-3 {
    margin-top: ${({ theme }) => theme.spacing.md};
  }

  .mt-4 {
    margin-top: ${({ theme }) => theme.spacing.lg};
  }

  /* Loading animations */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes slideInUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideInDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-slide-up {
    animation: slideInUp 0.3s ease-out;
  }

  .animate-slide-down {
    animation: slideInDown 0.3s ease-out;
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral.light};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral.medium};
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.neutral.dark};
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }

  button:focus,
  a:focus,
  input:focus,
  textarea:focus,
  select:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }

  /* Print styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    a,
    a:visited {
      text-decoration: underline;
    }

    thead {
      display: table-header-group;
    }

    tr,
    img {
      page-break-inside: avoid;
    }

    img {
      max-width: 100% !important;
    }

    @page {
      margin: 0.5cm;
    }

    p,
    h2,
    h3 {
      orphans: 3;
      widows: 3;
    }

    h2,
    h3 {
      page-break-after: avoid;
    }
  }
`;

export default GlobalStyles;