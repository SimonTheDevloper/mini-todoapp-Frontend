export function getFeedbackToPasswort(password) {
    const result = zxcvbn(password);
    console.log(result)
    const score = result.score;

    const stärkeÜbersicht = [
        { text: "very weak" },
        { text: "weak" },
        { text: "okay" },
        { text: "stong" },
        { text: "very strong" }
    ]
    const stärke = stärkeÜbersicht[score]

    return stärke
}