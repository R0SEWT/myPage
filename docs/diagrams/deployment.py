from diagrams import Diagram
from diagrams.c4 import Container, Person, Relationship, SystemBoundary

from common import EDGE_ATTR, GRAPH_ATTR, NODE_ATTR, OUTPUT_FORMAT


with Diagram(
    "Portfolio Deployment Topology",
    filename="deployment",
    direction="LR",
    outformat=OUTPUT_FORMAT,
    show=False,
    graph_attr=GRAPH_ATTR,
    node_attr=NODE_ATTR,
    edge_attr=EDGE_ATTR,
):
    maintainer = Person(
        "Maintainer",
        "Updates the repository source code, content, and deployment settings.",
        external=True,
    )
    visitor = Person(
        "Site visitor",
        "Requests the public portfolio at rosewt.dev.",
        external=True,
    )

    with SystemBoundary("Repository"):
        source = Container(
            "Frontend source",
            "rosewt-arariwa/",
            "React/Vite application code, data constants, styles, and public assets.",
        )
        config = Container(
            "Deployment config",
            "netlify.toml",
            "Defines the base directory, build command, publish directory, and SPA redirect.",
        )

    with SystemBoundary("Netlify delivery"):
        build = Container(
            "Build job",
            "Node 20 + npm run build",
            "Runs the production build from rosewt-arariwa/ using the repository configuration.",
        )
        artifact = Container(
            "Static artifact",
            "dist/",
            "Compiled HTML, JavaScript, CSS, and copied public assets ready for publishing.",
        )
        hosting = Container(
            "Hosting and CDN",
            "rosewt.dev",
            "Serves the site globally and rewrites unknown routes to /index.html.",
        )

    maintainer >> Relationship("updates") >> source
    source >> Relationship("provides build input to") >> build
    config >> Relationship("configures") >> build
    build >> Relationship("produces") >> artifact
    artifact >> Relationship("is published to") >> hosting
    visitor >> Relationship("requests") >> hosting
