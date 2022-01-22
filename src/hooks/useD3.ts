import React from 'react';
import * as d3 from 'd3';

export const useD3 = (renderChartFn: { (svg: any): void; (arg0: d3.Selection<SVGSVGElement, unknown, null, undefined>): void; }, dependencies: any): React.RefObject<SVGSVGElement> => {
    const ref = React.useRef<SVGSVGElement>(null);

    React.useEffect(() => {
        renderChartFn(d3.select(ref.current));
        return () => { };
    }, dependencies);
    return ref;
}