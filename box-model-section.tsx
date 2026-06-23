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
      <span className="w-10 text-right text-[#6B7280]">{label}</span>
      <div className="flex-1">
        <div
          className="border text-center py-1 text-[#374151]"
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
    <div className="px-4 py-2.5 border-b border-[#F3F4F6]">
      <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
        Box Model
      </div>
      <div className="flex flex-col gap-1.5">
        <BoxRow
          top={boxModel.marginTop}
          right={boxModel.marginRight}
          bottom={boxModel.marginBottom}
          left={boxModel.marginLeft}
          color="#F59E0B"
          bg="rgba(245,158,11,0.08)"
          label="margin"
          inner={
            <BoxRow
              top={boxModel.borderTop}
              right={boxModel.borderRight}
              bottom={boxModel.borderBottom}
              left={boxModel.borderLeft}
              color="#6366F1"
              bg="rgba(99,102,241,0.08)"
              label="border"
              inner={
                <BoxRow
                  top={boxModel.paddingTop}
                  right={boxModel.paddingRight}
                  bottom={boxModel.paddingBottom}
                  left={boxModel.paddingLeft}
                  color="#22C55E"
                  bg="rgba(34,197,94,0.08)"
                  label="padding"
                  inner={
                    <div className="text-center py-1 bg-white text-[#374151]">
                      <div className="text-[9px] text-[#9CA3AF]">content</div>
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