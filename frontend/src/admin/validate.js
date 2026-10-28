const blank = (value) => !value || !String(value).trim();

// Same rules as the server. Returns a message for the first problem, or undefined.
//   required: [[field, 'Label'], ...]            must not be empty
//   pairs:    [[fieldA, fieldB, 'Name'], ...]    fill in both or leave both empty
export function firstProblem(values, { required = [], pairs = [] }) {
  for (const [field, label] of required) {
    if (blank(values[field])) return `${label} is required`;
  }
  for (const [a, b, name] of pairs) {
    if (blank(values[a]) !== blank(values[b])) {
      return `${name}: fill in both the text and the link, or leave both empty`;
    }
  }
  return undefined;
}
