// @flow
/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import type {TodoListFooter_todoConnection$key} from 'relay/TodoListFooter_todoConnection.graphql';
import type {TodoListFooter_user$key} from 'relay/TodoListFooter_user.graphql';

import {useRemoveCompletedTodosMutation} from '../mutations/RemoveCompletedTodosMutation';

import * as React from 'react';
import {graphql, useFragment} from 'react-relay';

type Props = {|
  todoConnectionRef: TodoListFooter_todoConnection$key,
  userRef: TodoListFooter_user$key,
|};

export default function TodoListFooter({
  userRef,
  todoConnectionRef,
}: Props): React$Element<'footer'> {
  const user = useFragment(
    graphql`
      fragment TodoListFooter_user on User {
        totalCount
        completedCount
        ...RemoveCompletedTodosMutation_user
      }
    `,
    userRef,
  );
  const todoConnection = useFragment(
    graphql`
      fragment TodoListFooter_todoConnection on TodoConnection {
        ...RemoveCompletedTodosMutation_todoConnection
      }
    `,
    todoConnectionRef,
  );

  const commitRemoveCompletedTodosMutation = useRemoveCompletedTodosMutation(
    user,
    todoConnection,
  );

  const numRemainingTodos = user.totalCount - user.completedCount;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{numRemainingTodos}</strong> item
        {numRemainingTodos === 1 ? '' : 's'} left
      </span>

      {user.completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={commitRemoveCompletedTodosMutation}>
          Clear completed
        </button>
      )}
    </footer>
  );
}
