document.addEventListener("DOMContentLoaded", () => {
    window.setTimeout(startPartnerRotator, 0);
});

function startPartnerRotator() {
    const tracks = document.querySelectorAll(
        ".partner-right.slide-1 .partner-logo-track, " +
        ".partner-right.slide-2 .partner-logo-track, " +
        ".partner-right.slide-3 .partner-logo-track"
    );
    if (tracks.length === 0) return;

    const transitionDuration = 500;
    let isAnimating = false;

    window.setInterval(() => {
        if (isAnimating || [...tracks].some((track) => track.matches(":hover"))) return;

        const advancingTracks = [...tracks].flatMap((track) => {
            const activeRow = track.firstElementChild;
            const nextRow = activeRow?.nextElementSibling;
            return activeRow && nextRow ? [{ track, activeRow, nextRow }] : [];
        });
        if (advancingTracks.length === 0) return;

        isAnimating = true;
        advancingTracks.forEach(({ track, activeRow, nextRow }) => {
            activeRow.classList.remove("is-active");
            nextRow.classList.add("is-active");

            const rowHeight = activeRow.getBoundingClientRect().height;
            track.style.transition = `transform ${transitionDuration}ms ease`;
            track.style.transform = `translateY(-${rowHeight}px)`;
        });

        window.setTimeout(() => {
            advancingTracks.forEach(({ track, activeRow }) => {
                track.appendChild(activeRow);
                track.style.transition = "none";
                track.style.transform = "translateY(0)";
                track.offsetHeight;
                track.style.transition = "";
            });
            isAnimating = false;
        }, transitionDuration);
    }, 500);
}