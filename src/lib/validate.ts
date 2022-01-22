// Safety check
//   - every key from previous package.json is in the next package.json
//   - every key in the next package.json is in the previous package.json
export default function validate(
  prevPkg: { [k: string]: unknown },
  nextPkg: { [k: string]: unknown }
): void | never {
  const prevAccountedFor = Object.keys(prevPkg).every((k) => k in nextPkg);
  const nextAccountedFor = Object.keys(nextPkg).every((k) => k in prevPkg);

  if (prevAccountedFor && nextAccountedFor) return;

  throw new Error(
    'Something went wrong and some keys were lost - this job was cancelled and nothing written.'
  );
}
