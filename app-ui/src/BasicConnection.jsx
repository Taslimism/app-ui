import createEngine, { DiagramModel, DefaultNodeModel, DefaultPortModel, DefaultLinkFactory, DefaultLinkModel, DefaultLinkWidget } from '@projectstorm/react-diagrams';
import { LinkWidget } from '@projectstorm/react-diagrams-core';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import styles from './BasicConnection.module.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';



export class AdvancedLinkModel extends DefaultLinkModel {
    constructor() {
        super({
            type: 'advanced',
            width: 4
        });
    }
}

export class AdvancedPortModel extends DefaultPortModel {
    createLinkModel() {
        return new AdvancedLinkModel();
    }
}

const CustomLinkArrowWidget = props => {
    const { point, previousPoint } = props;

    const angle =
        90 +
        (Math.atan2(
            point.getPosition().y - previousPoint.getPosition().y,
            point.getPosition().x - previousPoint.getPosition().x
        ) *
            180) /
        Math.PI;

    //translate(50, -10),
    return (
        <g className="arrow" transform={'translate(' + point.getPosition().x + ', ' + point.getPosition().y + ')'}>
            <g style={{ transform: 'rotate(' + angle + 'deg)' }}>
                <g transform={'translate(0, -3)'}>
                    <polygon
                        points="0,10 8,30 -8,30"
                        fill={props.color}
                        onMouseLeave={() => {
                            this.setState({ selected: false });
                        }}
                        onMouseEnter={() => {
                            this.setState({ selected: true });
                        }}
                        data-id={point.getID()}
                        data-linkid={point.getLink().getID()}></polygon>
                </g>
            </g>
        </g>
    );
};

export class AdvancedLinkWidget extends DefaultLinkWidget {
    generateArrow(point, previousPoint) {
        return (
            <CustomLinkArrowWidget
                key={point.getID()}
                point={point}
                previousPoint={previousPoint}
                colorSelected={this.props.link.getOptions().selectedColor}
                color={this.props.link.getOptions().color}
            />
        );
    }

    render() {
        //ensure id is present for all points on the path
        const points = this.props.link.getPoints();
        const paths = [];
        this.refPaths = [];

        //draw the multiple anchors and complex line instead
        for (let j = 0; j < points.length - 1; j++) {
            paths.push(
                this.generateLink(
                    LinkWidget.generateLinePath(points[j], points[j + 1]),
                    {
                        'data-linkid': this.props.link.getID(),
                        'data-point': j,
                        onMouseDown: (event) => {
                            this.addPointToLink(event, j + 1);
                        }
                    },
                    j
                )
            );
        }

        //render the circles
        for (let i = 1; i < points.length - 1; i++) {
            paths.push(this.generatePoint(points[i]));
        }

        if (this.props.link.getTargetPort() !== null) {
            paths.push(this.generateArrow(points[points.length - 1], points[points.length - 2]));
        } else {
            paths.push(this.generatePoint(points[points.length - 1]));
        }

        return <g data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
    }
}

export class AdvancedLinkFactory extends DefaultLinkFactory {
    constructor() {
        super('advanced');
    }

    generateModel() {
        return new AdvancedLinkModel();
    }

    generateReactWidget(event) {
        return <AdvancedLinkWidget link={event.model} diagramEngine={this.engine} />;
    }
}

const Canvas = (props) => {


    const engine = createEngine();
    engine.getLinkFactories().registerFactory(new AdvancedLinkFactory());

    const node1 = new DefaultNodeModel('Source', `${props.sourceColor}`);
    let port1 = node1.addPort(new AdvancedPortModel(false, 'out'));
    node1.setPosition(100, 100);

    node1.registerListener({
        selectionChanged: function (e) {
            console.log({ id: e.entity.options.id, name: e.entity.options.name });
        },
        entityRemoved: function (e) {
            console.log(e);
        }
    })

    const node2 = new DefaultNodeModel('Destination', `${props.destColor}`);

    const port2 = node2.addPort(new AdvancedPortModel(true, 'in'));
    node2.setPosition(500, 350);

    node2.registerListener({
        selectionChanged: function (e) {
            console.log({ id: e.entity.options.id, name: e.entity.options.name });
        },
        entityRemoved: function (e) {
            console.log('entity');
            console.log(e);
        }
    })

    const model = new DiagramModel();



    let link = port1.link(port2);


    if (link) {
        link.registerListener({
            sourcePortChanged: function (e) { console.log(e); },
            targetPortChanged: function (e) { console.log(e); },
            selectionChanged: function (e) { console.log(e); },
            entityRemoved: function (e) { console.log(e); },
        })
    }



    // add everything else

    model.addAll(node1, node2, link);


    // load model into engine
    engine.setModel(model);





    return <CanvasWidget className={styles.container} engine={engine} />


};

export default Canvas;