import type { BoxModel } from './types';

function fmt(val: string): string {
  if (val === '0px') return '0';
  return val;
}

function BoxRow({
  top,
  right,
  bottom,
  left,
  color,
  bg,
  label,
  inner,
}: {
  top: string; right: string; bottom: string; left: string;
  color: string; bg: string; label: string;
  inner: React.ReactNode;
}) {
  const allSame = top === right && right === bottom && bottom === left;
  const display = allSame ? fmt(top) : `${fmt(top)} ${fmt(right)} ${fmt(bottom)} ${fmt(left)}`;

  return (
    <div className="flex items-center gap-2 text-[10px] font-mono">
      <span className="w-12 text-right text-[#8B949E] flex-shrink-0">{label}</span>
      <div className="flex-1">
        <div
          className="border text-center py-1 text-[#E6EDF3] rounded-sm"
          style={{ borderColor: color, backgroundColor: bg }}
        >
          {allSame ? (
            <span>{display}</span>
          ) : (
            <div className="flex justify-between px-1">
              <span>{fmt(top)}</span>
              <span>{fmt(right)}</span>
              <span>{fmt(bottom)}</span>
              <span>{fmt(left)}</span>
            </div>
          )}
          <div className="mt-1">{inner}</div>
        </div>
      </div>
    </div>
  );
}

export function BoxModelSection({ boxModel }: { boxModel: BoxModel }) {
  return (
    <div className="px-4 py-2.5 border-b border-[#30363D]">
      <div className="text-[11px] font-semibold text-[#8B949E] uppercase tracking-wider mb-2">
        Box Model
      </div>
      <div className="flex flex-col gap-1.5">
        <BoxRow
          top={boxModel.marginTop}
          right={boxModel.marginRight}
          bottom={boxModel.marginBottom}
          left={boxModel.marginLeft}
          color="#D29922"
          bg="rgba(210, 153, 34, 0.06)"
          label="margin"
          inner={
            <BoxRow
              top={boxModel.borderTop}
              right={boxModel.borderRight}
              bottom={boxModel.borderBottom}
              left={boxModel.borderLeft}
              color="#58A6FF"
              bg="rgba(88, 166, 255, 0.06)"
              label="border"
              inner={
                <BoxRow
                  top={boxModel.paddingTop}
                  right={boxModel.paddingRight}
                  bottom={boxModel.paddingBottom}
                  left={boxModel.paddingLeft}
                  color="#3FB950"
                  bg="rgba(63, 185, 80, 0.06)"
                  label="padding"
                  inner={
                    <div className="text-center py-1 bg-[#0D1117] rounded-sm text-[#E6EDF3]">
                      <div className="text-[9px] text-[#6E7681]">content</div>
                      <div>{fmt(boxModel.width)} x {fmt(boxModel.height)}</div>
                    </div>
                  }
                />
              }
            />
          }
        />
      </div>
    </div>
  );
}