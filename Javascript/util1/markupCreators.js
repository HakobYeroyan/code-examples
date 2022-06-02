export class MemoryItem {
  static render(item) {
    return `
      <li class="memories__item" data-id="${item.id}" id="${item.id}">
        <a class="memories__item-link" href="#">
          <div class="memories__item_image-container">
            <img class="memories__item_image"
              src="${item.image}" alt="${item.title}">
          </div>
          <div class="memories__item_body">
            <h4 class="memories__item_heading">
              ${item.title}
            </h4>
            <p class="memories__item_description">
              ${item.description}
            </p>
          </div>
          <div class="memories__item_footer">
            <span class="memories__item_date">
              ${item.date}
            </span>
          </div>
        </a>
      </li>
    `;
  }
}

export class TagItem {
  static render(item) {
    return `
      <li class="memories__tags-item" style="border: solid 2px ${item.tagColor}">
        ${item.tagName}
      </li>
    `;
  }
}