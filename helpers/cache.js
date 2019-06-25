class Cached {
    
    getGenres(movieGenres) {
        if (movieGenres) {
            return JSON.parse(localStorage.GENRES)
                .filter(genre => movieGenres.includes(genre.id))
                .reduce((final, item) => {
                    final.push(item.name);
                    return final;
                }, [])
                .join(',');
        }
        return [];
    }

}

module.exports.Cached = Cached;