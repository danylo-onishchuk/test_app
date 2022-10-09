export default function validateData(data) {
  const regex = /^[a-zA-Z0-9]+$/;

  if (regex.test(data)) {
    return true;
  }

  return false;
}
