const requiredFields = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'sex',
  'ageBracket',
  'dateOfBirth',
  'battalion',
  'lhbLevel',
  'lhbCode',
  'relationshipStatus',
  'address',
  'country',
  'personalityType',
  'fiveFoldGift',
  'education',
  'jobStatus',
  'incomeRange',
  'purposeStatus',
  'primaryMountain',
  'secondaryMountain',
];

export default function calculateProfileCompletion(user) {
  if (!user) return 0;

  const total = requiredFields.length;
  const filled = requiredFields.filter((key) => !!user[key]).length;

  return Math.round((filled / total) * 100);
}
