import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { VISUALISE_AXES_PREFIX } from 'lib/constants/visualise';
import { updateModel } from 'ui/redux/modules/models';
import { isContextActivity } from 'ui/utils/visualisations';
import Dropdown from 'ui/components/Material/Dropdown';
import DebounceInput from 'react-debounce-input';
import CountEditor from './CountEditor';
import GroupEditor from './GroupEditor';
import BaseAxesEditor from './BaseAxesEditor';

export class BarAxesEditor extends BaseAxesEditor {
  static propTypes = {
    model: PropTypes.instanceOf(Map),
    queryBuilderCacheValueModels: PropTypes.instanceOf(Map),
    updateModel: PropTypes.func
  };

  shouldComponentUpdate = (nextProps) => {
    const prevAxes = this.props.model.filter((item, key) => key.startsWith(VISUALISE_AXES_PREFIX));
    const nextAxes = nextProps.model.filter((item, key) => key.startsWith(VISUALISE_AXES_PREFIX));

    const isEqualsQueryBuilderCacheValue = this.props.queryBuilderCacheValueModels.equals(nextProps.queryBuilderCacheValueModels);

    return !prevAxes.equals(nextAxes) || !isEqualsQueryBuilderCacheValue;
  };

  renderDefinitionTypeSelector = () => {
    const searchPath = this.props.model.getIn(['axesgroup', 'searchString'], '');
    if (!isContextActivity(searchPath)) {
      return null;
    }

    const defaultOption = {
      value: null,
      label: 'All Definition Types'
    };

    return (
      <div className="form-group">
        <label htmlFor="toggleInput" className="clearfix">Content Activities Definition Type</label>

        <Dropdown
          auto
          onChange={(value) => {
            const group = this.getAxesValue('group');
            if (group) {
              const updatedGroup = group.set('contextActivityDefinitionType', value);
              this.changeAxes('group', updatedGroup);
            }
          }}
          source={[defaultOption].concat(
            this.props.queryBuilderCacheValueModels
            .filter(c => c.get('path', '') === `${this.props.model.getIn(['axesgroup', 'searchString'], '')}.definition.type`)
            .map(c => ({
              value: c.get('value'),
              label: c.get('value'),
            }))
            .toList()
            .toJS()
          )}
          value={this.getAxesValue('group', new Map()).get('contextActivityDefinitionType', null)} />
      </div>
    );
  }

  render = () => (
    <div>
      <div className="form-group">
        <label htmlFor="toggleInput" className="clearfix">X Axis</label>
        <div className="form-group">
          <DebounceInput
            id={'xAxisLabel'}
            className="form-control"
            placeholder={this.props.model.getIn(['axesvalue', 'searchString'], 'X-Axis')}
            debounceTimeout={377}
            style={{ fontWeight: 'bold' }}
            value={this.props.model.get('axesxLabel')}
            onChange={this.handleAxesChange.bind(this, 'xLabel')} />
        </div>
        <div className="form-group">
          <CountEditor
            type={this.props.model.get('type')}
            value={this.getAxesValue('value')}
            operator={this.getAxesValue('operator')}
            changeValue={this.changeAxes.bind(this, 'value')}
            changeOperator={this.changeAxes.bind(this, 'operator')} />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="toggleInput" className="clearfix">Y Axis</label>
        <div className="form-group">
          <DebounceInput
            id={'yAxisLabel'}
            className="form-control"
            placeholder={this.props.model.getIn(['axesgroup', 'searchString'], 'Y-Axis')}
            debounceTimeout={377}
            style={{ fontWeight: 'bold' }}
            value={this.props.model.get('axesyLabel')}
            onChange={this.handleAxesChange.bind(this, 'yLabel')} />
        </div>
        <div className="form-group">
          <GroupEditor
            group={this.getAxesValue('group')}
            changeGroup={this.changeAxes.bind(this, 'group')} />
        </div>
      </div>

      {this.renderDefinitionTypeSelector()}
    </div>
  );
}

export default connect(() => ({}), { updateModel })(BarAxesEditor);
