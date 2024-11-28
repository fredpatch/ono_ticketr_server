const validate_event = (
  title,
  description,
  content,
  tags,
  banner,
  location,
  startDateTime,
  draft,
  price
) => {
  if (!draft) {
    if (!description.length || description.length > 300) {
      return "@@ The description provided must be under 400 characters";
    }

    if (!banner.length) {
      return "@@ You must provide a banner for your post";
    }

    // if (!content.blocks.length) {
    //   return "@@ Please provide some content before your publication";
    // }

    if (!tags.length || tags.length > 5) {
      return "@@ You can only add up to 5 tags";
    }

    if (!location.length) {
      return "@@ You must provide a location for your event";
    }

    if (!startDateTime.length) {
      return "@@ You must provide a start date for your event";
    }

    if (!price.length) {
      return "@@ You must provide a price for your event";
    }
  }

  if (!title.length) {
    return "@@ You must provide a title for your post";
  }
  return null;
};

export default validate_event;
