// you may use the following page to test:
// http://www.cheminfo.org/?viewURL=https%3A%2F%2Fcouch.cheminfo.org%2Fcheminfo-public%2Fb9728349aa850f575f594496a2a38233%2Fview.json&loadversion=true&fillsearch=Twig+dynamic+form+experiments

module.exports = `

<style>
    #physicalForm input[type=number] {
        width: 50px;
    }
    #physicalForm > table > tbody > tr > th {
        font-size:18px;
    }
</style>
<div id='physicalForm'>
    <h1>Physical</h1>
    
<table>
    <tr>
        <th>bp [°C]</th>
        <td>
            <table>
                <tr>
                    <th></th><th></th>
                    <th>Low</th>
                    <th>High</th>
                    <th>P (torr)</th>
                    <th>DOI</th>
                </tr>
                <tr data-repeat='bp'>
                    <td>
                        <input type='number' max=100000 data-field='low'>
                    </td>
                    <td>
                        <input type='number' data-field='high'>
                    </td>
                    <td>
                        <input type='number' data-field='pressure'>
                    </td>
                    <td>
                        <input type='text' size=20 data-field='doi'>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table>
    <tr>
        <th>mp [°C]</th>
        <td>
            <table>
                <tr>
                    <th></th><th></th>
                    <th>Low</th>
                    <th>High</th>
                    <th>DOI</th>
                </tr>
                <tr data-repeat='mp'>
                    <td>
                        <input type='number' max=100000 data-field='low'>
                    </td>
                    <td>
                        <input type='number' data-field='high'>
                    </td>
                    <td>
                        <input type='text' size=20 data-field='doi'>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table>
    <tr>
        <th>density</th>
        <td>
            <table>
                <tr>
                    <th></th><th></th>
                    <th>Low</th>
                    <th>High</th>
                    <th>Temp [°C]</th>
                    <th>DOI</th>
                </tr>
                <tr data-repeat='density'>
                    <td>
                        <input type='number' max=100000 data-field='low'>
                    </td>
                    <td>
                        <input type='number' data-field='high'>
                    </td>
                    <td>
                        <input type='number' data-field='temperature'>
                    </td>
                    <td>
                        <input type='text' size=20 data-field='doi'>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table>
    <tr>
        <th>nd</th>
        <td>
            <table>
                <tr>
                    <th></th><th></th>
                    <th>Low</th>
                    <th>High</th>
                    <th>Temp [°C]</th>
                    <th>DOI</th>
                </tr>
                <tr data-repeat='nd'>
                    <td>
                        <input type='number' max=100000 data-field='low'>
                    </td>
                    <td>
                        <input type='number' data-field='high'>
                    </td>
                    <td>
                        <input type='number' data-field='temperature'>
                    </td>
                    <td>
                        <input type='text' size=20 data-field='doi'>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table>
    <tr>
        <th>[α]</th>
        <td>
            <table>
                <tr>
                    <th></th><th></th>
                    <th>Low</th>
                    <th>High</th>
                    <th>Temp [°C]</th>
                    <th>𝝺 (nm)</th>
                    <th>[] (g/100mL)</th>
                    <th>Solvent</th>
                    <th>DOI</th>
                </tr>
                <tr data-repeat='alpha'>
                    <td>
                        <input type='number' data-field='low'>
                    </td>
                    <td>
                        <input type='number' data-field='high'>
                    </td>
                    <td>
                        <input type='number' data-field='temperature'>
                    </td>
                    <td>
                        <input type='number' data-field='wavelength'>
                    </td>
                    <td>
                        <input type='number' data-field='concentration'>
                    </td>
                    <td>
                        <input type='text' size=10 data-field='solvent'>
                    </td>
                    <td>
                        <input type='text' size=20 data-field='doi'>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table>
    <tr>
        <th>Rf</th>
        <td>
            <table>
                <tr>
                    <th></th><th></th>
                    <th>Solvent</th>
                    <th>Plate</th>
                    <th>Low</th>
                    <th>High</th>
                </tr>
                <tr data-repeat='rf'>
                    <td>
                        <table>
                             <tr>
                                <th></th><th></th>
                                <th>Name</th>
                                <th>Parts</th>
                            </tr>
                            <tr data-repeat='solvent'>
                                <td nowrap>
                                    <select data-field='name'>
                                        <option value=""></option>
                                        <option value="MeOH">MeOH</option>
                                        <option value="EtOH">EtOH</option>
                                        <option value="propanol">propanol</option>
                                        <option value="CH2Cl2">CH2Cl2</option>
                                        <option value="H2O">H2O</option>
                                        <option value="TFA">TFA</option>
                                        <option value="hexanes">hexanes</option>
                                        <option value="hexane">hexane</option>
                                        <option value="pentane">pentane</option>
                                        <option value="cyclohexane">cyclohexane</option>
                                        <option value="AcOEt">AcOEt</option>
                                    </select>
                                </td>
                                <td>
                                    <input type='number' data-field='part'>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <select data-field='plate'>
                            <option value=""></option>
                            <option value="alumina">alumina</option>
                            <option value="silica">silica</option>
                            <option value="C-18">C-18</option>
                        </select>
                    </td>
                    <td>
                        <input type='number' data-field='low'>
                    </td>
                    <td>
                        <input type='number' data-field='high'>
                    </td>
                    <td>
                        <input type='text' size=20 data-field='doi'>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table>
    <tr>
        <th>Specific surface area</th>
        <td>
            <table>
                <tr>
                    <th></th><th></th>
                    <th>Probe</th>
                    <th>Method</th>
                    <th>Temp [°C]</th>
                    <th>Surface [m<sup>2</sup>/g]</th>
                </tr>
                <tr data-repeat='specificSurfaceArea'>
                    <td>
                        <select data-field='probe'>
                            <option value=""></option>
                            <option value="N2">N2</option>
                            <option value="Ar">Ar</option>
                        </select>
                    </td>
                    <td>
                    <select data-field='method'>
                        <option value=""></option>
                        <option value="Langmuir">Langmuir</option>
                        <option value="BET">BET</option>
                    </select>
                    </td>
                    <td>
                        <input type='number' data-field='temperature'>
                    </td>
                    <td>
                        <input type='number' data-field='value'>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table>
    <tr>
        <th>Specific pore volume</th>
        <td>
            <table>
                <tr>
                    <th></th><th></th>
                    <th>Probe</th>
                    <th>Temp [°C]</th>
                    <th>Volume [cm<sup>3</sup>/g]</th>
                </tr>
                <tr data-repeat='specificPoreVolume'>
                    <td>
                        <select data-field='probe'>
                            <option value=""></option>
                            <option value="N2">N2</option>
                            <option value="Ar">Ar</option>
                        </select>
                    </td>
                    <td>
                        <input type='number' data-field='temperature'>
                    </td>
                    <td>
                        <input type='number' data-field='value'>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table>
    <tr>
        <th>Gas permeability</th>
        <td>
            <table>
                <tr>
                    <th></th><th></th>
                    <th>Gas</th>
                    <th>Temp [°C]</th>
                    <th>Permeability [Barrer]</th>
                </tr>
                <tr data-repeat='gasPermeability'>
                    <td>
                        <select data-field='gas'>
                            <option value=""></option>
                            <option value="He">He</option>
                            <option value="H2">H2</option>
                            <option value="CO2">CO2</option>
                            <option value="CH4">CH4</option>
                            <option value="C2H4">C2H4</option>
                            <option value="C3H6">C3H6</option>
                            <option value="C3H8">C3H8</option>
                        </select>
                    </td>
                    <td>
                        <input type='number' data-field='temperature'>
                    </td>
                    <td>
                        <input type='number' data-field='value'>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table>
    <tr>
        <th>Gas permselectivity</th>
        <td>
            <table>
                <tr>
                    <th></th><th></th>
                    <th>Gas 1</th>
                    <th>Gas 2</th>
                    <th>Temp [°C]</th>
                    <th>Selectivity</th>
                </tr>
                <tr data-repeat='gasPermselectivity'>
                    <td>
                        <select data-field='gas1'>
                            <option value=""></option>
                            <option value="H2">H2</option>
                            <option value="N2">N2</option>
                            <option value="O2">O2</option>
                            <option value="CO2">CO2</option>
                            <option value="CH4">CH4</option>
                            <option value="C2H4">C2H4</option>
                            <option value="C2H6">C2H6</option>
                            <option value="C3H6">C3H6</option>
                            <option value="C3H8">C3H8</option>
                        </select>
                    </td>
                    <td>
                        <select data-field='gas2'>
                            <option value=""></option>
                            <option value="H2">H2</option>
                            <option value="N2">N2</option>
                            <option value="O2">O2</option>
                            <option value="CO2">CO2</option>
                            <option value="CH4">CH4</option>
                            <option value="C2H4">C2H4</option>
                            <option value="C2H6">C2H6</option>
                            <option value="C3H6">C3H6</option>
                            <option value="C3H8">C3H8</option>
                        </select>
                    </td>
                    <td>
                        <input type='number' data-field='temperature'>
                    </td>
                    <td>
                        <input type='number' data-field='value'>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

</div>


<script>
    console.log('Parsing the template');
    require(['vh/util/twigAdvancedForm'], function(AF) {
        AF('physicalForm', {debug:true});
    });
</script>


`;
