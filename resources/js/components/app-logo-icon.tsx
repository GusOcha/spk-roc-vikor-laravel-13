import type { SVGAttributes } from 'react';

/**
 * App logo: ascending bars — evoking the ranked shortlist a decision-support
 * system produces (ROC-VIKOR). Single colour so it works with `fill-current`.
 */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.5" y="14" width="4.5" height="7" rx="1.2" />
            <rect x="9.75" y="9" width="4.5" height="12" rx="1.2" />
            <rect x="16.5" y="3" width="4.5" height="18" rx="1.2" />
        </svg>
    );
}
