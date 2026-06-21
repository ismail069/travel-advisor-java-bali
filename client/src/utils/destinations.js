export function destinationDisplayName(destination, language = 'en') {
  if (!destination) return '';
  return language === 'id' && destination.name_id ? destination.name_id : destination.name;
}
