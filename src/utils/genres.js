const SHORT_LABELS = {
  'Science Fiction': 'Sci-Fi',
  'Documentary': 'Doc',
}

export const genreLabel = (name) => SHORT_LABELS[name] || name
