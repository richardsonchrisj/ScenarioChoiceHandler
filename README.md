<a name="readme-top"></a>

[![LinkedIn][linkedin-shield]][linkedin-url]
[![MIT License][license-shield]][license-url]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://chrisrichardson.dev">
    <img src="images/logo.png" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center"> Scenario Choice Handler</h3>

  <p align="center">A quick additional js file to capture scenario responses in <a href="https://articulate.com/360/rise">Rise 360</a> courses   <br />
    <br />
    ·
    <a href="https://github.com/richardsonchrisj/ScenarioChoiceHandler/issues">Report Bug</a>
    ·
    <a href="https://github.com/richardsonchrisj/ScenarioChoiceHandler/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#references">References</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot2]](https://chrisrichardson.dev)

I wanted to save xAPI statements when someone selects options in the scenarios I create using [Rise 360](https://articulate.com/360/rise). Articulate doesn't provide that functionality. So I built some additional code that can be added. It grabs the questions and selected answers from the scenario and sends it to your Learning Records Store. 

[![Product Name Screen Shot][product-screenshot3]](https://chrisrichardson.dev)

To use this yourself, just copy the [scenario.js](https://github.com/richardsonchrisj/ScenarioChoiceHandler/blob/master/faker/lib/scenario.js) file in the [lib](https://github.com/richardsonchrisj/ScenarioChoiceHandler/tree/master/faker/lib) folder and put it in your own exported Rise course folder.

You'll also need to add this line to your `index.html` file: ` <script type="text/javascript" src="lib/scenario.js"></script>`. 


[![Product Name Screen Shot][product-screenshot6]](https://chrisrichardson.dev)


I've included a sample course called [Faker](https://github.com/richardsonchrisj/ScenarioChoiceHandler/tree/master/faker) that demonstrates how it all works. If you're using an LRS like [SCORM Cloud](https://scorm.com/), you can download the [Faker](https://github.com/richardsonchrisj/ScenarioChoiceHandler/tree/master/faker) course, zip it, and upload it to your LRS.

[![Product Name Screen Shot][product-screenshot]](https://chrisrichardson.dev)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Author Link: [chrisrichardson.dev](https://chrisrichardson.dev)
</br>
Project Link: [https://github.com/richardsonchrisj/ScenarioChoiceHandler](https://github.com/richardsonchrisj/ScenarioChoiceHandler)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- REFERENCES -->

## References

Here are a few great resources if you're learning about xAPI and related tools

- [xAPI Resources](https://xapi.com/dev-resources/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/richardsonchrisj/ScenarioChoiceHandler.svg?style=for-the-badge
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/richardsonchrisj
[contributors-url]: https://github.com/richardsonchrisj/ScenarioChoiceHandler/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/richardsonchrisj/ScenarioChoiceHandler.svg?style=for-the-badge
[forks-url]: https://github.com/richardsonchrisj/ScenarioChoiceHandler/network/members
[stars-shield]: https://img.shields.io/github/stars/richardsonchrisj/ScenarioChoiceHandler.svg?style=for-the-badge
[stars-url]: https://github.com/richardsonchrisj/ScenarioChoiceHandler/stargazers
[issues-shield]: https://img.shields.io/github/issues/richardsonchrisj/ScenarioChoiceHandler.svg?style=for-the-badge
[issues-url]: https://github.com/richardsonchrisj/ScenarioChoiceHandler/issues
[license-shield]: https://img.shields.io/github/license/richardsonchrisj/ScenarioChoiceHandler.svg?style=for-the-badge
[license-url]: https://github.com/richardsonchrisj/ScenarioChoiceHandler/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
[product-screenshot2]: images/screenshot2.png
[product-screenshot3]: images/screenshot3.png
[product-screenshot4]: images/screenshot4.png
[product-screenshot5]: images/screenshot5.png
[product-screenshot6]: images/screenshot6.png
[product-screenshot7]: images/screenshot7.png
