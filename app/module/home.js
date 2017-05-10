var _plApp;
(function($) {
    "use strict";

    /**
     *  EXAMPLE page with the new react wrapper
     * @type {{page: string}}
     */

    var info = {
        page: 'home'
    };
    var deus = new $._deus(info.page), r = deus.pub();

    var _ = {
        button: function(name, cd) {
            return (r('div').class('transition click mini ui button').on('click', function(e) {
                cd();
            }).c(name));
        }
    };

    r.style('full', {width: '100%', height: '100%'});
    r.style('abs', {position: 'absolute', left: '0px', width: '100%'});
    r.style('head', {position: 'fixed', top: '0px', zIndex: 99, width: '100%', background: 'white'});
    r.style('segment', {width: '800px', margin: '0 auto', overflow: 'auto'});

    var base = r.create({
        getInitialState: function() {
            return ({size: window.innerWidth, scroll: 0});
        },
        resize: function() {
            this.setState({size: window.innerWidth});
        },
        scroll: function(e) {
            this.setState({scroll: e.target.body.scrollTop});
        },
        componentDidMount: function() {
            window.addEventListener('scroll', this.scroll);
            window.addEventListener('resize', this.resize);
        },
        componentWillUnmount: function() {
            window.removeEventListener('scroll', this.scroll);
            window.removeEventListener('resize', this.resize);
        },
        clamp: function(start, zone) {
            return (Math.max(-zone, Math.min(zone, this.state.scroll - start)) / zone);
        },
        render: function() {

            return (r('div').create(
                r('div').style('head').c(
                    r('div').style('segment', {height: '100px', overflow: 'hidden'}).c(
                        r('div').style({float: 'left', lineHeight: '90px'}).c(
                            r('img').set({src: 'http://placehold.it/60x60'}).style({float: 'left', margin: '20px 10px', height: '50px'}).c(),
                            r('div').style({float: 'left'}).c('Lorem ipsum dolor')
                        ),
                        r('div').style({height: '90px', lineHeight: '90px'}).c(
                            r('div').style({float: 'right', padding: '10px'}).c('Lorem ipsum dolor'),
                            r('div').style({float: 'right', padding: '10px'}).c('Lorem ipsum dolor'),
                            r('div').style({float: 'right', padding: '10px'}).c('Lorem ipsum dolor'),
                            r('div').style({float: 'right', padding: '10px'}).c('Lorem ipsum dolor')
                        )
                    )
                ),
                r('div').style({height: '400px', position: 'relative', marginTop: '90px'}).c(
                    r('div').style('abs', {width: '100%', height: '100%', top: '0px', zIndex: 0}).c(
                        r('div').style('full', {backgroundPositionY: (this.clamp(-50, 300) * 100) + '%', backgroundImage: 'url("http://placehold.it/500x500")'}).c()
                    ),
                    r('div').style('abs full', {background: 'rgba(0, 140, 255, 0.5)'}).c(
                        r('div').style({width: '800px', margin: '0 auto', zIndex: 1, color: 'white', marginTop: 'calc(25% - 100px)'}).c(
                            r('h1').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet'),
                            r('div').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet')
                        )
                    )
                ),
                r('div').style({height: '200px'}).c(
                    r('div').style('segment', {height: '100%', width: '600px', overflow: 'hidden'}).c(
                        r('img').set({src: 'http://placehold.it/100x100'}).style({height: '100px', margin: '50px 10px'}).c(),
                        r('img').set({src: 'http://placehold.it/100x100'}).style({height: '100px', margin: '50px 10px'}).c(),
                        r('img').set({src: 'http://placehold.it/100x100'}).style({height: '100px', margin: '50px 10px'}).c(),
                        r('img').set({src: 'http://placehold.it/100x100'}).style({height: '100px', margin: '50px 10px'}).c(),
                        r('img').set({src: 'http://placehold.it/100x100'}).style({height: '100px', margin: '50px 10px'}).c()
                    )
                ),
                r('div').style({background: '#1c1c1c'}).c(
                    r('div').style({width: '800px', padding: '10px', margin: '0 auto', zIndex: 1, color: 'white'}).c(
                        r('h1').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet'),
                        r('div').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet')
                    ),
                    r('div').style({height: '100%', width: '660px', margin: '0 auto'}).c(
                        r('img').set({src: 'http://placehold.it/200x200'}).style({height: '200px', margin: '50px 10px'}).c(),
                        r('img').set({src: 'http://placehold.it/200x200'}).style({height: '200px', margin: '50px 10px'}).c(),
                        r('img').set({src: 'http://placehold.it/200x200'}).style({height: '200px', margin: '50px 10px'}).c()
                    )
                ),
                r('div').c(
                    r('div').style('segment', {padding: '10px'}).c(
                        r('div').style({width: '380px', float: 'left'}).c(
                            r('img').set({src: 'http://placehold.it/300x300'}).style({height: '300px', margin: '50px 10px'}).c()
                        ),
                        r('div').style({width: '380px', float: 'left'}).c(
                            r('div').style({margin: '90px 10px'}).c(
                                r('h1').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet'),
                                r('div').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet')
                            )
                        )
                    )
                ),
                r('div').style({height: '400px', position: 'relative', marginTop: '90px'}).c(
                    r('div').style('abs', {width: '100%', height: '100%', top: '0px', zIndex: 0}).c(
                        r('div').style('backImg full', {backgroundPositionY: (this.clamp(800, 600) * 100) + '%', backgroundImage: 'url("http://placehold.it/500x500")'}).c()
                    ),
                    r('div').style('abs full', {background: 'rgba(0, 140, 255, 0.5)'}).c(
                        r('div').style({width: '800px', margin: '0 auto', zIndex: 1, color: 'white', marginTop: 'calc(25% - 100px)'}).c(
                            r('h1').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet'),
                            r('div').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet')
                        )
                    )
                ),
                r('div').c(
                    r('div').style('segment', {padding: '75px 10px'}).c(
                        r('div').style({width: '250px', float: 'left'}).c(
                            r('h3').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet'),
                            r('div').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet')
                        ),
                        r('div').style({width: '250px', float: 'left'}).c(
                            r('h3').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet'),
                            r('div').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet')
                        ),
                        r('div').style({width: '250px', float: 'left'}).c(
                            r('h3').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet'),
                            r('div').c('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet')
                        )
                    )
                ),
                r('div').style({height: '50px', background: '#1c1c1c', color: 'white', lineHeight: '50px', textAlign: 'center'}).c(
                    r('div').c('© Copyright 2014-2017 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis non lectus et laoreet')
                )
            ))
        }
    });

    $.page.add(info.page, {
        index: function() {
            ReactDOM.render(r(base).c(), document.getElementById('container'));
            return (true);
        }
    });
})(_plApp || (_plApp = {}));