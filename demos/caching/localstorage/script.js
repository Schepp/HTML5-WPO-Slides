(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var items = document.querySelectorAll('style[data-id], script[data-id]');
        items = Array.prototype.slice.call(items,0);
        items.forEach(function (item) {
            var key = item.getAttribute('data-id'),
                timestamp = item.getAttribute('data-modified'),
                value = item.textContent;

            localStorage.removeItem(key);
            localStorage.setItem(key, value);
            if (localStorage.getItem(key)) {
                document.cookie = key + '=' + timestamp;
                console.log('Added/updated ' + key + ' to localStorage');
            }
        });
    });
}());